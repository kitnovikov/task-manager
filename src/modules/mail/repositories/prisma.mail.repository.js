export default class PrismaMailRepository {
    constructor(database) {
        this.database = database
    }

    async create(userId) {
        return this.database.client.token.create({
            select: {
                userId: true,
                refreshToken: true,
            },
            data: { userId }
        })
    }
}