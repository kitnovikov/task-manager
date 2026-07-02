import yup from "yup";

const token = yup.string().matches(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    'Invalid token format'
).required()

export const tokensSchema = yup.object({
    accessToken: token,
    refreshToken: token,
})