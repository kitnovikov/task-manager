export default class EmailConfirmationTokenPayloadDto {
    constructor(data) {
        this.id = data.id
        this.email = data.email
    }
}