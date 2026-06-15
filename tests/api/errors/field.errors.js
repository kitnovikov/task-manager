export default {
    required: ({field}) => `${field} is a required field`,
    type: ({ field, expectedType, value }) => `${field} must be a \`${expectedType}\` type, but the final value was: \`${value}\`.`,
    min: ({ field, min }) => `${field} must be at least ${min} characters`,
    max: ({ field, max }) => `${field} must be at most ${max} characters`,
    email: ({field}) => `${field} must be a valid email`,
}