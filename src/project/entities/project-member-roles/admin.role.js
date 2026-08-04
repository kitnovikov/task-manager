import {ProjectMemberRoles} from "../project-member-roles.js";

export default class AdminRole {
    constructor() {
        this.value = ProjectMemberRoles.Admin
    }

    canAddProjectMember() {
        return true
    }

    canGetProjectMembers() {
        return true
    }

    canDeleteProjectMember() {
        return true
    }

    canUpdateProjectMemberRole() {
        return false
    }
}