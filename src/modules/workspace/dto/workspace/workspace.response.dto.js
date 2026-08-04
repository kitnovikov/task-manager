export default class WorkspaceResponseDto {
    constructor(workspace) {
        this.id = workspace.id
        this.name = workspace.name
        this.slug = workspace.slug
        this.description = workspace.description
        this.ownerId = workspace.ownerId
    }
}
