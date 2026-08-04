export default class ValidationError extends Error {
    constructor(message) {
        super('Ошибка валидации')
        this.statusCode = 400
        this.name = this.constructor.name
        this.messages = Array.isArray(message) ? message : [ message ]
    }
}
