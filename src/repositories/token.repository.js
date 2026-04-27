export default class TokenRepository {
    constructor(database) {
        this.database = database
    }

    async create(userId, refreshToken) {
        return this.database.client.token.create({
            select: {
                userId: true,
                refreshToken: true,
            },
            data: { userId, refreshToken }
        })
    }

    async findOne(props) {
        return this.database.client.token.findFirst({
            select: {
                userId: true,
                refreshToken: true,
            },
            where: { ...props }
        })
    }

    async update(userId, refreshToken) {
        return this.database.client.token.update({
            select: {
                userId: true,
                refreshToken: true,
            },
            where: { userId },
            data: { refreshToken }
        })
    }
}