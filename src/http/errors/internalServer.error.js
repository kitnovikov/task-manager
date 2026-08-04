export default class InternalServerError extends Error {
    constructor() {
        super('Произошла внутренняя ошибка сервера')
        this.name = this.constructor.name
        this.statusCode = 500
    }
}
