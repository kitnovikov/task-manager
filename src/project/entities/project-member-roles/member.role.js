import {ProjectMemberRoles} from "../project-member-roles.js";

export default class MemberRole {
    constructor() {
        this.value = ProjectMemberRoles.Member
    }

    canAddProjectMember() {
        return false
    }

    canGetProjectMembers() {
        return false
    }

    canDeleteProjectMember() {
        return false
    }

    canUpdateProjectMemberRole() {
        return false
    }
}