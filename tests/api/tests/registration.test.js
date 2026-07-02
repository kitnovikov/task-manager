import {beforeAll, describe, expect, test} from "@jest/globals";
import API from "../services/gateway.js";
import HttpClient from "../client/http.client.js";
import ConfigService from "../config/config.service.js";
import { randomCorrectUser } from "../fixtures/randomUser.js";
import { expectedData, expectedSchema, expectedStatus } from "../asserts/asserts.js";
import { registrationSchema } from "../schemas/registration.schema.js";
import { errorSchema } from "../schemas/error.schema.js";
import { userIsExistError } from "../errors/user.error.js";
import {
    combinedNegativeRegistrationCases,
    registrationValidationCases,
    validRegistrationCases
} from "../fixtures/registration.fixtures.js";

describe('Регистрация пользователя', () => {
    let api

    beforeAll(() => {
        const config = new ConfigService()
        const client = new HttpClient(config)
        api = new API(client)
    })

    describe('Успешная регистрация', () => {
        test.each(validRegistrationCases)('$title', async ({ data }) => {
            const body = data
            const expectedBody = {
                firstName: body.firstName.trim(),
                lastName: body.lastName.trim(),
                email: body.email.toLowerCase(),
                isVerified: false,
            }

            const response = await api.authService.registration(body)

            await expectedStatus(response.status, 201)
            await expectedSchema(registrationSchema, response.data)
            await expectedData(response.data.user, expectedBody)
            expect(response.data.user).not.toHaveProperty('password')
        })
    })

    describe('Проверки бизнес-логики', () => {
        test('Проверить уникальность email. Email уже зарегистрирован', async () => {
            const body = randomCorrectUser()
            await api.authService.registration(body)

            const response = await api.authService.registration(body)

            await expectedStatus(response.status, 400)
            await expectedSchema(errorSchema, response.data)
            await expectedData(response.data, userIsExistError)
        })

        test('Проверить уникальность email. Email отличается регистром символов', async () => {
            const body = randomCorrectUser()
            await api.authService.registration(body)

            const body2 = { ...randomCorrectUser(), email: body.email.toUpperCase() }
            const response = await api.authService.registration(body2)

            await expectedStatus(response.status, 400)
            await expectedSchema(errorSchema, response.data)
            await expectedData(response.data, userIsExistError)
        })

        // [!]: Добавить тесты на создание пользователя, который удален
    })

    describe.each(registrationValidationCases)('Валидация поля $field', ({ field, valid, invalid }) => {
        test.each(invalid)(`$title`, async ({ value }) => {
            const data = { ...randomCorrectUser(), [field]: value }

            const response = await api.authService.registration(data)

            await expectedStatus(response.status, 400)
            await expectedSchema(errorSchema, response.data)
            await expectedData(response.data, {
                statusCode: 400,
                error: 'ValidationError',
            })
        })

        test.each(valid)('$title', async ({ value }) => {
            const data = { ...randomCorrectUser(), [field]: value }
            const expectedBody = {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email.trim().toLowerCase(),
                isVerified: false,
            }

            const response = await api.authService.registration(data)

            await expectedStatus(response.status, 201)
            await expectedSchema(registrationSchema, response.data)
            await expectedData(response.data.user, expectedBody)
            expect(response.data.user).not.toHaveProperty('password')
        })
    })

    describe('Комбинированные негативные сценарии', () => {
        test.each(combinedNegativeRegistrationCases)('$title', async ({ data }) => {
            const response = await api.authService.registration(data)

            await expectedStatus(response.status, 400)
            await expectedSchema(errorSchema, response.data)
            await expectedData(response.data, {
                statusCode: 400,
                error: 'ValidationError',
            })
        })
    })
})
