export default class RemoveProjectMemberRequestDto {
    constructor(data) {
        this.projectId = data.projectId
        this.userId = data.userId
        this.currentUserId = data.currentUserId
    }
}
