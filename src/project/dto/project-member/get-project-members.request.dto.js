export default class GetProjectMembersRequestDto {
    constructor(data) {
        this.projectId = data.projectId
        this.currentUserId = data.currentUserId
    }
}