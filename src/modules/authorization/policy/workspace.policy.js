import BasePolicy from "../../../lib/base.policy.js";

export default class WorkspacePolicy extends BasePolicy {
    static isExistWorkspace(workspace) {
        return Boolean(workspace)
    }

    static isArchivedWorkspace(workspace) {
        return workspace.isArchived() === true
    }

    static canGetArchivedWorkspace(member) {
        return member.isOwner() === true
    }
}
