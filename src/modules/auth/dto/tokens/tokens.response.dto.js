export default class TokensResponseDto {
    constructor(data) {
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
    }
}