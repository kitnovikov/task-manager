export default class AddProjectMemberDto {
    constructor(data) {
        this.projectId = data.projectId
        this.userId = data.userId
        this.createdBy = data.createdBy
        this.role = data.role
    }
}