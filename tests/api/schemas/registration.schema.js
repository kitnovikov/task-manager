import yup from "yup";
import {tokensSchema} from "./tokens.schema.js";
import {userSchema} from "./user.schema.js";

export const registrationSchema = yup.object({
    user: userSchema,
}).shape({ ...tokensSchema.fields })