export default class UpdateMemberRoleResponseDto {
    constructor(member) {
        this.id = member.id
        this.userId = member.userId
        this.role = member.role.getRole()
    }
}
