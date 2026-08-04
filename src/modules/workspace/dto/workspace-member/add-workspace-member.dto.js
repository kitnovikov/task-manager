export default class AddWorkspaceMemberDto {
    constructor(data) {
        this.workspaceId = data.workspaceId
        this.userId = data.userId
        this.role = data.role
        this.status = data.status
        this.invitedId = data.invitedId
    }
}