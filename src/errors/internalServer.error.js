export default class InternalServerError extends Error {
    constructor() {
        super('An internal server error occurred.')
        this.name = this.constructor.name
        this.statusCode = 500
    }
}