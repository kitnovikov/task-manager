import ProjectMemberEntity from "../entities/project-member.entity.js";
import toDomain from "./mappers/prisma.project-members.mapper.js";
import ProjectMemberWithUserReadModel from "../read-model/project-member-with-user.read-model.js";

export default class PrismaProjectMembersRepository {
    constructor(database) {
        this.database = database
    }

    async create(data) {
        const entity = await this.database.client.projectMember.create({
            select: {
                id: true,
                projectId: true,
                userId: true,
                role: true,
            },
            data: data
        })

        return toDomain(entity)
    }

    async findOne(projectId, userId) {
        const entity = await this.database.client.projectMember.findFirst({
            select: {
                id: true,
                projectId: true,
                userId: true,
                role: true,
            },
            where: { projectId, userId }
        })

        return toDomain(entity)
    }

    async findAllWithUsers(projectId) {
        const entities = await this.database.client.projectMember.findMany({
            where: { projectId },
            select: {
                id: true,
                role: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        })

        return entities
            ? entities.map((entity) => new ProjectMemberWithUserReadModel(entity))
            : null
    }

    async remove(id) {
        const entity = await this.database.client.projectMember.delete({
            select: {
                id: true,
                projectId: true,
                userId: true,
                role: true,
            },
            where: { id }
        })

        return toDomain(entity)
    }

    async updateRole(id, role) {
        const entity = await this.database.client.projectMember.update({
            select: {
                id: true,
                userId: true,
                role: true,
            },
            where: { id },
            data: { role }
        })

        return toDomain(entity)
    }
}
