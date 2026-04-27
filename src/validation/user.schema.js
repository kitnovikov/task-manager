import { string, object } from 'yup'
import BaseSchema from "../lib/schema.base.js";

export default class UserSchema extends BaseSchema {
    static id = string().required().uuid()
    static firstName = string().required().min(3).max(30)
    static lastName = string().required().min(3).max(30)
    static email = string().required().email()
    static password = string()
        .required()
        .min(8, 'Password is too short - should be 8 chars minimum')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters')
        .matches(/\d/, 'Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>+=_-]/, 'Password must contain a special character')

    static createUserSchema = object({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
    })

    static updateUserSchema = object({
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
    })
}