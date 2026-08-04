import { string, object } from 'yup'
import BaseSchema from "../../../lib/schema.base.js";

export default class UserSchema extends BaseSchema {
    static id = string()
        .required('Идентификатор пользователя обязателен')
        .uuid('Идентификатор пользователя должен быть UUID')

    static firstName = string()
        .required('Имя обязательно')
        .strict(true)
        .min(3, 'Имя должно содержать минимум 3 символа')
        .max(30, 'Имя должно содержать максимум 30 символов')

    static lastName = string()
        .required('Фамилия обязательна')
        .strict(true)
        .min(3, 'Фамилия должна содержать минимум 3 символа')
        .max(30, 'Фамилия должна содержать максимум 30 символов')

    static email = string().required('Email обязателен').strict(true).matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
        'Email должен иметь корректный домен, например .com'
    ).min(7, 'Email должен содержать минимум 7 символов').max(255, 'Email должен содержать максимум 255 символов')

    static password = string()
        .required('Пароль обязателен')
        .strict(true)
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .max(64, 'Пароль должен содержать максимум 64 символа')
        .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
        .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
        .matches(/\d/, 'Пароль должен содержать хотя бы одну цифру')
        .matches(/[!@#$%^&*(),.?":{}|<>+=_-]/, 'Пароль должен содержать хотя бы один специальный символ')

    static userRegistrationSchema = object({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
    }).noUnknown(true, 'Переданы неизвестные поля')
}
