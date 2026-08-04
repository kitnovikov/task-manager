import MemberRole from "./project-member-roles/member.role.js";
import AdminRole from "./project-member-roles/admin.role.js";
import OwnerRole from "./project-member-roles/owner.role.js";
import {ProjectMemberRoles} from "./project-member-roles.js";

export default class ProjectMemberRole {
    roles = Object.freeze({
        Member: MemberRole,
        Admin: AdminRole,
        Owner: OwnerRole,
    })

    constructor(value) {
        this.setRole(value)
    }

    setRole(value) {
        if (!this.roles[value]) {
            throw new Error(`Invalid project member role: ${value}`)
        }

        this.role = new this.roles[value]()
    }

    isOwner() {
        return this.getRole() === ProjectMemberRoles.Owner
    }

    isAdmin() {
        return this.getRole() === ProjectMemberRoles.Admin
    }

    isMember() {
        return this.getRole() === ProjectMemberRoles.Member
    }

    getRole() {
        return this.role.value
    }

    canAddProjectMember() {
        return this.role.canAddProjectMember()
    }

    canGetProjectMembers() {
        return this.role.canGetProjectMembers()
    }

    canDeleteProjectMember() {
        return this.role.canDeleteProjectMember()
    }

    canUpdateProjectMemberRole() {
        return this.role.canUpdateProjectMemberRole()
    }
}