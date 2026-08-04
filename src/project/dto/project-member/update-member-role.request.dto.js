export default class UpdateMemberRoleRequestDto {
    constructor(data) {
        this.projectId = data.projectId
        this.userId = data.userId
        this.currentUserId = data.currentUserId
        this.role = data.role
    }
}
