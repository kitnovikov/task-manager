import { describe, expect, test } from '@jest/globals';
import UserSchema from "../../../src/validation/user.schema.js";
import ValidationError from "../../../src/errors/validation.error.js";

describe('UserSchema.createUserSchema - decision table (optimized with test.each)', () => {
    const baseValidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'Abcdef1!'
    }

    const validate = async (data) => UserSchema.validator(UserSchema.createUserSchema, data)

    const expectSuccess = async (data) => {
        const result = await validate(data)
        expect(result).toEqual(data)
    }

    const expectFail = async (data) => {
        try {
            await validate(data)
        } catch (err) {
            expect(err).toBeInstanceOf(ValidationError)
            expect(err.statusCode).toBe(400)
            expect(err.message).toBeDefined()
        }
    }

    // -------------------------
    // SUCCESS CASE
    // -------------------------
    test('valid user', async () => {
        await expectSuccess(baseValidUser)
    })

    // -------------------------
    // firstName (2–7)
    // -------------------------
    test.each([
        ['empty', ''],
        ['too short', 'Jo'],
        ['too long', 'a'.repeat(31)]
    ])('firstName invalid case: %s', async (_, value) => {
        await expectFail({ ...baseValidUser, firstName: value })
    })

    test.each([
        ['min boundary', 'Jon'],
        ['max boundary', 'a'.repeat(30)],
        ['trim spaces', '  John  ']
    ])('firstName valid case: %s', async (_, value) => {
        await expectSuccess({ ...baseValidUser, firstName: value })
    })

    // -------------------------
    // lastName (8–13)
    // -------------------------
    test.each([
        ['empty', ''],
        ['too short', 'Li'],
        ['too long', 'a'.repeat(31)]
    ])('lastName invalid case: %s', async (_, value) => {
        await expectFail({ ...baseValidUser, lastName: value })
    })

    test.each([
        ['min boundary', 'Lee'],
        ['max boundary', 'a'.repeat(30)],
        ['trim spaces', '  Ivanov  ']
    ])('lastName valid case: %s', async (_, value) => {
        await expectSuccess({ ...baseValidUser, lastName: value })
    })

    // -------------------------
    // email (14–20)
    // -------------------------
    test.each([
        ['empty', ''],
        ['no @', 'user.test.com'],
        ['missing domain', 'user@'],
        ['double @', 'user@@test.com'],
        ['invalid domain', 'user@.com']
    ])('email invalid case: %s', async (_, value) => {
        await expectFail({ ...baseValidUser, email: value })
    })

    test.each([
        ['valid email', 'user@test.com'],
        ['minimal valid email', 'a@b.com']
    ])('email valid case: %s', async (_, value) => {
        await expectSuccess({ ...baseValidUser, email: value })
    })

    // -------------------------
    // password (21–30)
    // -------------------------
    test.each([
        ['empty', ''],
        ['too short', 'Ab1!abc'],
        ['only letters', 'Abcdefgh'],
        ['only numbers', '12345678'],
        ['only special chars', '!@#$%^&*'],
        ['missing uppercase', 'abcdef1!'],
        ['missing lowercase', 'ABCDEF1!'],
        ['missing digit', 'Abcdefg!'],
        ['missing special char', 'Abcdef12']
    ])('password invalid case: %s', async (_, value) => {
        await expectFail({ ...baseValidUser, password: value })
    })

    test.each([
        ['valid minimum boundary', 'Abcdef1!']
    ])('password valid case: %s', async (_, value) => {
        await expectSuccess({ ...baseValidUser, password: value })
    })

    // -------------------------
    // combined scenarios (31–34)
    // -------------------------
    test.each([
        ['all empty', {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }],
        ['multiple invalid short fields', {
            firstName: 'Jo',
            lastName: 'Li',
            email: 'user',
            password: '123'
        }],
        ['email + password invalid', {
            ...baseValidUser,
            email: 'invalid',
            password: '123'
        }],
        ['multiple name fields invalid', {
            firstName: '',
            lastName: '',
            email: 'user@test.com',
            password: 'Abcdef1!'
        }]
    ])('combined case: %s', async (_, value) => {
        await expectFail(value)
    })
})