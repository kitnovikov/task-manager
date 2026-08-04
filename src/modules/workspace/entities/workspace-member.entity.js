import {WorkspaceMemberRolesEnum} from "./workspace-member-roles.enum.js";
import {WorkspaceMemberStatusesEnum} from "./workspace-member-statuses.enum.js";

export default class WorkspaceMemberEntity {
    constructor(data) {
        this.id = data.id
        this.workspaceId = data.workspaceId
        this.userId = data.userId
        this.role = data.role
        this.status = data.status
        this.invitedId = data.invitedId
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }

    isOwner() {
        return this.role === WorkspaceMemberRolesEnum.Owner
    }

    isActive() {
        return this.status === WorkspaceMemberStatusesEnum.Active
    }
}