import BaseGuard from "../../../lib/base.guard.js";
import WorkspacePolicy from "../policy/workspace.policy.js";
import NotFoundError from "../../../http/errors/notFound.error.js";
import ForbiddenError from "../../../http/errors/forbidden.error.js";
import WorkspaceMemberPolicy from "../policy/workspace-member.policy.js";
import ConflictError from "../../../http/errors/conflict.error.js";

export default class WorkspaceAccessGuard extends BaseGuard {
    static assertCanArchiveWorkspace(member, workspace) {
        this.assertActiveMember(member)
        this.assertWorkspaceExists(workspace)
        this.assertMemberHasPermission(member, 'canArchiveWorkspace', 'У вас нет прав на архивирование рабочего пространства')

        if (WorkspacePolicy.isArchivedWorkspace(workspace)) {
            throw new ConflictError('Рабочее пространство уже в архиве')
        }
    }

    static assertCanUnarchiveWorkspace(member, workspace) {
        this.assertActiveMember(member)
        this.assertWorkspaceExists(workspace)
        this.assertMemberHasPermission(member, 'canUnarchiveWorkspace', 'У вас нет прав на восстановление рабочего пространства')

        if (!WorkspacePolicy.isArchivedWorkspace(workspace)) {
            throw new ConflictError('Рабочее пространство не в архиве')
        }
    }

    static assertCanGetWorkspace(member, workspace) {
        this.assertActiveMember(member)
        this.assertWorkspaceExists(workspace)
        this.assertMemberHasPermission(member, 'canGetWorkspace', 'У вас нет прав на получение рабочего пространства')

        if (WorkspacePolicy.isArchivedWorkspace(workspace) && !WorkspacePolicy.canGetArchivedWorkspace(member)) {
            throw new NotFoundError('Рабочее пространство находится в архиве. У вас нет доступа к нему')
        }
    }

    static assertCanUpdateWorkspace(member, workspace) {
        this.assertActiveMember(member)
        this.assertWorkspaceExists(workspace)
        this.assertMemberHasPermission(member, 'canUpdateWorkspace', 'У вас нет прав на изменение рабочего пространства')

        if (WorkspacePolicy.isArchivedWorkspace(workspace)) {
            throw new NotFoundError('Рабочее пространство находится в архиве. Разархивируйте его, чтобы внести изменения')
        }
    }

    static assertActiveMember(member) {
        if (!WorkspaceMemberPolicy.isExistMember(member) || !WorkspaceMemberPolicy.isActiveMember(member)) {
            throw new NotFoundError('Рабочее пространство не найдено')
        }
    }

    static assertWorkspaceExists(workspace) {
        if (!WorkspacePolicy.isExistWorkspace(workspace)) {
            throw new NotFoundError('Рабочее пространство не найдено')
        }
    }

    static assertMemberHasPermission(member, permission, message) {
        if (!WorkspaceMemberPolicy.hasPermission(member, permission)) {
            throw new ForbiddenError(message)
        }
    }
}
