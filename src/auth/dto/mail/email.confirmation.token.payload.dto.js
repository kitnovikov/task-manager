export default class EmailConfirmationTokenPayloadDto {
    constructor(data) {
        this.email = data.email
    }
}