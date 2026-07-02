export default class RegistrationResponseDto {
    constructor(data) {
        this.user = {
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            isVerified: data.user.isVerified(),
            createdAt: data.user.createdAt,
        }
        this.accessToken = data.tokens.accessToken
        this.refreshToken = data.tokens.refreshToken
    }
}