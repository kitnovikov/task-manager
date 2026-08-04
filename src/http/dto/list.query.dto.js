import BadRequestError from "../errors/badRequest.error.js";

export default class ListQueryDto {
    DEFAULT_PAGE = 1
    DEFAULT_LIMIT = 20
    MAX_LIMIT = 100

    constructor(query) {
        const page = Number(query.page ?? this.DEFAULT_PAGE)
        const limit = Number(query.limit ?? this.DEFAULT_LIMIT)

        if (!Number.isInteger(page) || page < 1) {
            throw new BadRequestError('Некорректный номер страницы')
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > this.MAX_LIMIT) {
            throw new BadRequestError(`Количество элементов должно быть от 1 до ${this.MAX_LIMIT}`)
        }


        this.page = page
        this.limit = limit
        this.offset = (page - 1) * limit
    }
}