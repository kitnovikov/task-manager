import BaseRepository from "../../../lib/base.repository.js"
import WorkspaceMemberEntity from "../entities/workspace-member.entity.js";
import WorkspaceWithMemberRoleReadModel from "../read-model/workspace-with-member-role.read-model.js";

export default class WorkspaceMemberRepository extends BaseRepository {
    async create(data, tx) {
        const client = tx ?? this.database.client
        const entity = await client.workspaceMember.create({
            data: data,
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                status: true,
                invitedId: true,
            }
        })

        return entity ? new WorkspaceMemberEntity(entity) : null
    }

    async findOne(data) {
        const entity = await this.database.client.workspaceMember.findFirst({
            where: data,
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                status: true,
                createdAt: true,
                invitedId: true,
            }
        })

        return entity ? new WorkspaceMemberEntity(entity) : null
    }

    async findAll(data) {
        const entities = await this.database.client.workspaceMember.findMany(data)
        return entities ? entities.map((entity) => new WorkspaceWithMemberRoleReadModel(entity.workspaces, entity)) : null
    }
}