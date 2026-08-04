export default class CreateWorkspaceDto {
    constructor(data) {
        this.name = data.name
        this.slug = data.slug
        this.description = data.description
        this.status = data.status
        this.ownerId = data.ownerId
        this.updatedBy = data.updatedBy
    }
}