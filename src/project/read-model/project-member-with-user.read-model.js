export default class ProjectMemberWithUserReadModel {
    constructor(data) {
        this.id = data.id
        this.role = data.role
        this.joinedAt = data.createdAt
        this.user = {
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
        }
    }
}