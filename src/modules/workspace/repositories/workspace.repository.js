import BaseRepository from "../../../lib/base.repository.js";
import WorkspaceEntity from "../entities/workspace.entity.js";
import WorkspaceWithMemberRoleReadModel from "../read-model/workspace-with-member-role.read-model.js";

export default class WorkspaceRepository extends BaseRepository {
    async findOne(data) {
        const entity = await this.database.client.workspace.findFirst({
            where: data,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                status: true,
                ownerId: true,
                createdAt: true,
                updatedBy: true,
                updatedAt: true,
                archivedAt: true,
                archivedBy: true,
            }
        })

        return entity ? new WorkspaceEntity(entity) : null
    }

    async findByIdForMember(data) {
        const entity = await this.database.client.workspaceMember.findFirst({
            where: data,
            select: {
                role: true,
                createdAt: true,
                workspaces: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        status: true,
                        ownerId: true,
                        createdAt: true,
                    }
                }
            }
        })

        return entity ? new WorkspaceWithMemberRoleReadModel(entity) : null
    }

    async create(data, tx) {
        const client = tx ?? this.database.client
        const entity = await client.workspace.create({
            data: data,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                ownerId: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        return entity ? new WorkspaceEntity(entity) : null
    }

    // async findVisibleByMember(userId, ) {
    //     const entities = await this.database.client.workspaceMember.findMany({
    //         where: {
    //             userId: userId,
    //             status:
    //         }
    //     })
    // }

    async findAllByMemberId(userId, status, options) {
        const entities = await this.database.client.workspaceMember.findMany({
            where: {
                userId: userId,
                status: status,
            },
            select: {
                role: true,
                createdAt: true,
                workspaces: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        status: true,
                        ownerId: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: options.limit,
            skip: options.offset,
        })

        return entities.map((entity) => new WorkspaceWithMemberRoleReadModel(entity))
    }

    async update(query) {
        const entity = await this.database.client.workspace.update(query)
        return entity ? new WorkspaceEntity(entity) : null
    }
}
