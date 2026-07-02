import yup from "yup";

export const errorSchema = yup.object({
    statusCode: yup.number().required(),
    error: yup.string().required(),
    message: yup.lazy((value) => Array.isArray(value)
        ? yup.array().of(yup.string()).required()
        : yup.string().required()
    ),
}).noUnknown(true)