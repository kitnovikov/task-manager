export default async (schema, data) => {
    let errors = []

    try {
        await schema.validate(data, { abortEarly: false })
    } catch (error) {
        errors = [ ...error.errors ]
    }

    return errors
}