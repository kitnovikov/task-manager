import yup, { string } from 'yup'
import SchemaBase from "../lib/schema.base.js";

export default class UserSchema extends SchemaBase {
    static createUserSchema = yup.object({
        firstName: string().required().min(3),
        lastName: string().required().min(3),
        email: string().required().email(),
        password: string()
            .required()
            .min(8, 'Password is too short - should be 8 chars minimum')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters')
            .matches(/\d/, 'Password must contain a number')
            .matches(/[!@#$%^&*(),.?":{}|<>+=_-]/, 'Password must contain a special character'),
    })

    static updateUserSchema = yup.object({
        id: string().required().uuid(),
        firstName: string().min(3),
        lastName: string().min(3),
        email: string().email(),
        password: string()
            .min(8, 'Password is too short - should be 8 chars minimum')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters')
            .matches(/\d/, 'Password must contain a number')
            .matches(/[!@#$%^&*(),.?":{}|<>+=_-]/, 'Password must contain a special character'),
    })
}