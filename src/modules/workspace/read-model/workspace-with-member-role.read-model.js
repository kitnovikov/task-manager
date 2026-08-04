export default class WorkspaceWithMemberRoleReadModel {
    constructor(workspace, member) {
        this.id = workspace.id
        this.name = workspace.name
        this.slug = workspace.slug
        this.description = workspace.description
        this.status = workspace.status
        this.ownerId = workspace.ownerId
        this.currentUserRole = member.role
        this.joinedAt = member.createdAt
        this.createdAt = workspace.createdAt
    }
}
