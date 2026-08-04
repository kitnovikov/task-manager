export default {
    auth: {
        login: '/api/auth/login',
        registration: '/api/auth/registration',
    },
    emailConfirmation: {
        sendVerificationToken: '/api/email-confirmation/send',
        activeVerificationToken: '/api/email-confirmation/activate',
    },
    workspace: {
        create: '/api/workspaces',
        getAll: '/api/workspaces',
        getById: '/api/workspaces/:workspaceId',
        updateById: '/api/workspaces/:workspaceId',
        archiveById: '/api/workspaces/:workspaceId/archive',
        unarchiveById: '/api/workspaces/:workspaceId/unarchive',
    },
    project: {
        create: '/api/projects',
        getById: '/api/projects/:projectId',
    },
    projectMembers: {
        add: '/api/projects/:projectId/members',
        getAll: '/api/projects/:projectId/members',
        remove: '/api/projects/:projectId/members/:userId',
        updateRole: '/api/projects/:projectId/members/:userId/role',
    },
}
