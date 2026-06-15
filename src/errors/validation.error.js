export default class ValidationError extends Error {
    constructor(message) {
        super('Validation error')
        this.statusCode = 400
        this.name = this.constructor.name
        this.messages = Array.isArray(message) ? message : [ message ]
    }
}