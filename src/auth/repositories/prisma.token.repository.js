export default class PrismaTokenRepository {
    constructor(database) {
        this.database = database
    }

    async save(userId, refreshToken) {
        return this.database.client.token.create({
            select: {
                userId: true,
                refreshToken: true,
            },
            data: { userId, refreshToken }
        })
    }

    async findByUserId(id) {
        return this.database.client.token.findFirst({
            select: {
                userId: true,
                refreshToken: true,
            },
            where: { userId: id }
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