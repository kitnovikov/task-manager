export default class CreateUserDto {
    constructor(data) {
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.password = data.password
        this.email = data.email
    }
}