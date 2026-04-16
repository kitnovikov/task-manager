import yup from "yup";
import ValidationError from "../errors/validation.error.js";

export default class BaseSchema {
     static async validator(schema, data) {
        try {
            return await schema.validate(data, { abortEarly: false })
        } catch (error) {
            throw new ValidationError(error.errors)
        }
    }

    static schemaId = yup.string().required().uuid()
}