export default class ValidationError {
    constructor(message) {
        this.statusCode = 400
        this.name = this.constructor.name
        this.message = message
    }
}