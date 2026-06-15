import toDomain from "./mappers/prisma-user.mapper.js";

export default class PrismaUserRepository {
    constructor(database) {
        this.database = database
    }

    async save(user) {
        const entity = await this.database.client.user.create({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                status: true,
                password: true,
                email: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true,
            },
            data: user
        })

        return toDomain(entity)
    }

    async findById(id) {
        const user = await this.database.client.user.findFirst({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true,
            },
            where: { id }
        })

        return toDomain(user)
    }

    async findByEmail(email) {
        const user = await this.database.client.user.findFirst({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
            },
            where: { email }
        })

        return toDomain(user)
    }

    // async update(id, props) {
    //     const user = await this.database.client.user.update({
    //         select: {
    //             id: true,
    //             firstName: true,
    //             lastName: true,
    //             email: true,
    //             createdAt: true,
    //             updatedAt: true
    //         },
    //         where: { id },
    //         data: { ...props }
    //     })
    //
    //     return toDomain(user)
    // }
}