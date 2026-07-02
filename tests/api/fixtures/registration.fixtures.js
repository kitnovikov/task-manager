import {randomEmail, randomFirstName, randomLastName, randomPassword} from "../helpers/user.helpers.js";
import fieldErrors from '../errors/field.errors.js'

const stringTypeCases = [
    { title: 'Проверить тип. Передан number', value: 1, expectedMessage: ({ field, value }) => [
            fieldErrors.type({field, expectedType: 'string', value })
    ] },
    { title: 'Проверить тип. Передан boolean', value: true, expectedMessage: ({ field, value }) => [
            fieldErrors.type({field, expectedType: 'string', value })
    ] },
    { title: 'Проверить тип. Передан object', value: {}, expectedMessage: ({ field, value }) => [
            fieldErrors.type({field, expectedType: 'string', value: '{}' })
    ] },
    { title: 'Проверить тип. Передан array', value: [], expectedMessage: ({ field, value }) => [
            fieldErrors.type({field, expectedType: 'string', value: '[]' })
    ] },
]

const requiredStringCases = [
    { title: 'Проверить валидацию. Поле пустое', value: '', expectedMessage: ({ field }) => [
            fieldErrors.required({field }),
            fieldErrors.min({ field, min: 3 })
    ] },
    { title: 'Проверить валидацию. Передан null', value: null,expectedMessage: ({ field }) => [
            fieldErrors.required({field }),
    ] },
    { title: 'Проверить валидацию. Поле отсутствует', value: undefined, expectedMessage: ({ field }) => [
            fieldErrors.required({field }),
    ] },
    { title: 'Проверить валидацию. Переданы только пробелы', value: ' '.repeat(3), expectedMessage: ({ field }) => [
            fieldErrors.required({field }),
            fieldErrors.min({ field, min: 3 })
    ] },
]

export const validRegistrationCases = [
    {
        title: 'Создать пользователя. С валидными данными',
        get data() {
            return {
                firstName: randomFirstName(),
                lastName: randomLastName(),
                email: randomEmail(),
                password: randomPassword(),
            }
        },
    },
    {
        title: 'Создать пользователя. С минимально допустимыми значениями',
        data: {
            firstName: 'aaa',
            lastName: 'aaa',
            email: 'a@ma.ru',
            password: 'Aa1!aaaa',
        },
    },
    {
        title: 'Создать пользователя. С максимально допустимыми значениями',
        data: {
            firstName: 'a'.repeat(30),
            lastName: 'b'.repeat(30),
            email: `${'o'.repeat(246)}@mail.com`,
            password: `${'a'.repeat(61)}A1!`,
        },
    },
    {
        title: 'Создать пользователя. С пробелами по краям полей',
        get data() {
            return {
                firstName: ` ${randomFirstName()} `,
                lastName: ` ${randomLastName()} `,
                email: randomEmail().toUpperCase(),
                password: randomPassword(),
            }
        },
    },
]

export const combinedNegativeRegistrationCases = [
    {
        title: 'Проверить валидацию полей. Body отсутствует',
        data: {},
        expectedFields: ['firstName', 'lastName', 'email', 'password'],
        minErrorsCount: 12,
    },
    {
        title: 'Проверить валидацию полей. Все поля пустые',
        data: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        expectedFields: ['firstName', 'lastName', 'email', 'password'],
        minErrorsCount: 12,
    },
    {
        title: 'Проверить валидацию полей. Все поля невалидные',
        data: {
            firstName: 1,
            lastName: true,
            email: {},
            password: [],
        },
        expectedFields: ['firstName', 'lastName', 'email', 'password'],
        minErrorsCount: 4,
    },
    {
        title: 'Проверить валидацию полей. Несколько полей невалидны одновременно',
        data: {
            firstName: 'aa',
            lastName: 'b'.repeat(31),
            email: 'test.mail.com',
            password: 'Password1',
        },
        expectedFields: ['firstName', 'lastName', 'email', 'password'],
        minErrorsCount: 4,
    },
    {
        title: 'Проверить валидацию полей. Невалидны email и password',
        get data() {
            return {
                firstName: randomFirstName(),
                lastName: randomLastName(),
                email: 'test.mail.com',
                password: 'Password1',
            }
        },
        expectedFields: ['email', 'password'],
        minErrorsCount: 2,
    },
    {
        title: 'Проверить валидацию полей. Невалидны firstName и lastName',
        get data() {
            return {
                firstName: 'aa',
                lastName: 'b'.repeat(31),
                email: randomEmail(),
                password: randomPassword(),
            }
        },
        expectedFields: ['firstName', 'lastName'],
        minErrorsCount: 2,
    },
]

export const registrationValidationCases = [
    {
        field: 'firstName',
        invalid: [
            ...stringTypeCases,
            ...requiredStringCases,
            { title: 'Проверить минимальную длину. Меньше 3 символов', value: 'aa', expectedMessage: [] },
            { title: 'Проверить максимальную длину. Больше 30 символов', value: 'a'.repeat(31), expectedMessage: [] },
        ],
        valid: [
            { title: 'Проверить формат. Пробел в конце', value: randomFirstName().concat(' '), get expectedValue() { return this.value.trim() }},
            { title: 'Проверить минимальную длину. Ровно 3 символа', value: 'aaa', get expectedValue() { return this.value }},
            { title: 'Проверить максимальную длину. Ровно 30 символов', value: 'a'.repeat(30), get expectedValue() { return this.value }},
        ]
    },
    {
        field: 'lastName',
        invalid: [
            ...stringTypeCases,
            ...requiredStringCases,
            { title: 'Проверить минимальную длину. Меньше 3 символов', value: 'aa', expectedMessage: [] },
            { title: 'Проверить максимальную длину. Больше 30 символов', value: 'a'.repeat(31), expectedMessage: [] },
        ],
        valid: [
            { title: 'Проверить формат. Пробел в конце', value: randomLastName().concat(' '), get expectedValue() { return this.value.trim() }},
            { title: 'Проверить минимальную длину. Ровно 3 символа', value: 'aaa', get expectedValue() { return this.value }},
            { title: 'Проверить максимальную длину. Ровно 30 символов', value: 'a'.repeat(30), get expectedValue() { return this.value }},
        ]
    },
    {
        field: 'email',
        invalid: [
            ...stringTypeCases,
            ...requiredStringCases,
            { title: 'Проверить формат. Отсутствует символ @', value: 'test.mail.com', expectedMessage: [] },
            { title: 'Проверить формат. Отсутствует локальная часть', value: '@mail.com', expectedMessage: [] },
            { title: 'Проверить формат. Отсутствует домен', value: 'test@.com', expectedMessage: [] },
            { title: 'Проверить формат. Передан двойной символ @', value: 'test@@mail.com', expectedMessage: [] },
            { title: 'Проверить формат. Меньше 7 символов', value: 'n@m.ru', expectedMessage: [] },
            { title: 'Проверить формат. Больше 255 символов', value: `${'t'.repeat(247)}@mail.com`, expectedMessage: [] },
            { title: 'Проверить формат. Передана точка перед доменом', value: randomEmail().replace('@', '@.'), expectedMessage: [] },
            { title: 'Проверить формат. Передан email без TLD', value: randomEmail().split('.').at(0), expectedMessage: [] },
        ],
        valid: [
            { title: 'Проверить формат. Пробел в конце', value: randomEmail().concat(' '), get expectedValue() { return this.value.trim() }},
            { title: 'Проверить формат. Передан email в верхнем регистре', value: randomEmail().toUpperCase(), get expectedValue() { return this.value.toLowerCase() }},
            { title: 'Проверить формат. Ровно 7 символов', value: 'n@ma.ru', get expectedValue() { return this.value }},
            { title: 'Проверить формат. Ровно 255 символов', value: `${'a'.repeat(246)}@mail.com`, get expectedValue() { return this.value }},
        ]
    },
    {
        field: 'password',
        invalid: [
            ...stringTypeCases,
            ...requiredStringCases,
            { title: 'Проверить минимальную длину. Значение менее 8 символов', value: 'A1=ffg1', expectedMessage: [] },
            { title: 'Проверить минимальную длину. Значение больше 64 символов', value: `${'a'.repeat(62)}A1!`, expectedMessage: [] },
            { title: 'Проверить состав password. Отсутствуют цифры', value: 'Password!', expectedMessage: [] },
            { title: 'Проверить состав password. Отсутствуют буквы', value: '12345678!', expectedMessage: [] },
            { title: 'Проверить состав password. Отсутствуют спецсимволы', value: 'Password1', expectedMessage: [] },
            { title: 'Проверить состав password. Переданы только цифры', value: '12345678', expectedMessage: [] },
            { title: 'Проверить состав password. Переданы только буквы', value: 'Password', expectedMessage: [] },
            { title: 'Проверить состав password. Переданы только спецсимволы', value: '!@#$%^&*', expectedMessage: [] },
            { title: 'Проверить состав password. Отсутствуют uppercase символы', value: 'password1!' },
            { title: 'Проверить состав password. Отсутствуют lowercase символы', value: 'PASSWORD1!' },
        ],
        valid: [
            { title: 'Проверить минимальную длину. Значение равно 8 символам', value: 'Aa1!aaaa' },
            { title: 'Проверить минимальную длину. Значение равно 64 символа', value: `${'a'.repeat(61)}A1!` },
        ]
    }
]
