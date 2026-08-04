export default class UpdateWorkspaceRequestDto {
    constructor(data) {
        this.name = data.name
        this.description = data.description
    }
}