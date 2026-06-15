import { string, object } from 'yup'
import BaseSchema from "../../lib/schema.base.js";

export default class UserSchema extends BaseSchema {
    static id = string().required().uuid()
    static firstName = string().required().strict(true).min(3).max(30)
    static lastName = string().required().strict(true).min(3).max(30)
    static email = string().required().strict(true).matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
        'Email must have a valid domain (e.g. .com)'
    ).min(7).max(255)
    static password = string()
        .required()
        .strict(true)
        .min(8, 'Password is too short - should be 8 chars minimum')
        .max(64)
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>+=_-]/, 'Password must contain a special character')

    static userRegistrationSchema = object({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
    }).noUnknown(true)
}
