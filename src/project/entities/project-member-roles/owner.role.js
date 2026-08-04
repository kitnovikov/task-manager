import {ProjectMemberRoles} from "../project-member-roles.js";

export default class OwnerRole {
    constructor() {
        this.value = ProjectMemberRoles.Owner
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
        return true
    }
}