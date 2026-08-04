export default class CreateProjectRequestDto {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.createdBy = data.createdBy
    }
}
