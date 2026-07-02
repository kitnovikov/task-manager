import yup from "yup";

export const userSchema = yup.object({
    id: yup.string().required().uuid(),
    firstName: yup.string().required().min(3).max(30),
    lastName: yup.string().required().min(3).max(30),
    email: yup.string().email().min(7).max(255),
    isVerified: yup.boolean().required(),
    createdAt: yup.string().required().datetime(),
}).noUnknown(true)