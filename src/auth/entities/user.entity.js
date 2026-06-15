export default class UserEntity {
    constructor(data) {
        this.id = data.id
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.status = data.status
        this.email = data.email
        this.password = data.password
        this.emailVerifiedAt = data.emailVerifiedAt
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }

    isVerified() {
        return Boolean(this.emailVerifiedAt)
    }
}