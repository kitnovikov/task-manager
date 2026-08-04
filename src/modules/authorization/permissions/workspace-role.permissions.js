import {WorkspaceMemberRolesEnum} from "../../workspace/entities/workspace-member-roles.enum.js";

export const workspaceRolePermissions = Object.freeze({
    [WorkspaceMemberRolesEnum.Owner]: {
        canCreateWorkspace: true,
        canGetWorkspace: true,
        canArchiveWorkspace: true,
        canUnarchiveWorkspace: true,
        canUpdateWorkspace: true,
    },
    [WorkspaceMemberRolesEnum.Admin]: {
        canCreateWorkspace: true,
        canGetWorkspace: true,
        canArchiveWorkspace: false,
        canUnarchiveWorkspace: false,
        canUpdateWorkspace: true,
    },
    [WorkspaceMemberRolesEnum.Manager]: {
        canCreateWorkspace: true,
        canGetWorkspace: true,
        canArchiveWorkspace: false,
        canUnarchiveWorkspace: false,
        canUpdateWorkspace: false,
    },
    [WorkspaceMemberRolesEnum.Member]: {
        canCreateWorkspace: true,
        canGetWorkspace: true,
        canArchiveWorkspace: false,
        canUnarchiveWorkspace: false,
        canUpdateWorkspace: false,
    },
    [WorkspaceMemberRolesEnum.Viewer]: {
        canCreateWorkspace: true,
        canGetWorkspace: true,
        canArchiveWorkspace: false,
        canUnarchiveWorkspace: false,
        canUpdateWorkspace: false,
    }
})