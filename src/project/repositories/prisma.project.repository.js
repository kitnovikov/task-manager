import toDomain from "./mappers/prisma-project.mapper.js";

export default class PrismaProjectRepository {
    constructor(database) {
        this.database = database
    }

    async save(data) {
        const entity = await this.database.client.project.create({
            select: {
                id: true,
                name: true,
                description: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
            data: data
        })

        return toDomain(entity)
    }

    async findById(id) {
        const entity = await this.database.client.project.findFirst({
            select: {
                id: true,
                name: true,
                description: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
            where: { id }
        })

        return toDomain(entity)
    }

    async findByIdForMember(projectId, userId) {
        const entity = await this.database.client.project.findFirst({
            where: {
                id: projectId,
                members: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return toDomain(entity)
    }

    async findAllByIdForMember(userId) {
        const entities = await this.database.client.project.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return toDomain(entities)
    }
}
