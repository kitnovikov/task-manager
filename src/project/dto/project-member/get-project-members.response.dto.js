export default class GetProjectMembersResponseDto {
    constructor(members) {
        this.members = members.map((member) => ({
            id: member.id,
            role: member.role,
            joinedAt: member.joinedAt,
            user: {
                id: member.user.id,
                firstName: member.user.firstName,
                lastName: member.user.lastName,
                email: member.user.email,
            }
        }))
    }
}
