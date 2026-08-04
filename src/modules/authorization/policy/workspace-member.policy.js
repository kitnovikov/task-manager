import BasePolicy from "../../../lib/base.policy.js";
import {workspaceRolePermissions} from "../permissions/workspace-role.permissions.js";

export default class WorkspaceMemberPolicy extends BasePolicy {
    static isExistMember(member) {
        return Boolean(member)
    }

    static isActiveMember(member) {
        return member.isActive() === true
    }

    static hasPermission(member, permission) {
        return workspaceRolePermissions[member.role]?.[permission] === true
    }
}