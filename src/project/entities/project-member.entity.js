import ProjectMemberRole from "./project-member-role.js";

export default class ProjectMemberEntity {
    constructor(data) {
        this.id = data.id
        this.projectId = data.projectId
        this.userId = data.userId
        this.role = new ProjectMemberRole(data.role)
        this.createdBy = data.createdBy
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }
}