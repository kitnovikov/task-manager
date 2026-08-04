export default class ProjectEntity {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.createdBy = data.createdBy
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }
}