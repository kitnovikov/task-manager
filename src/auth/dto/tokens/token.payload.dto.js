export default class TokenPayloadDto {
    constructor(data) {
        this.id = data.id
        this.firstName = data.firstName
        this.lastName = data.lastName
    }
}