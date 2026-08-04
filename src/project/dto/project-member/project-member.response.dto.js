export default class ProjectMemberResponseDto {
    constructor(data) {
        this.id = data.id
        this.projectId = data.projectId
        this.userId = data.userId
        this.role = data.role.getRole()
    }
}