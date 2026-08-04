import routes from './routes.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import verificationUserMiddleware from "../middlewares/verificationUser.middleware.js";

export default class WorkspaceRoutes {
    constructor(app) {
        this.app = app
        this.workspaceController = app.container.workspaceController
        this.authorize = authMiddleware(this.app)
        this.verification = verificationUserMiddleware(this.app)
    }

    register() {
        const preHandler = [this.authorize, this.verification]

        this.app
            .post(
                routes.workspace.create,
                { preHandler },
                this.workspaceController.createWorkspace.bind(this.workspaceController)
            )
            .get(
                routes.workspace.getAll,
                { preHandler },
                this.workspaceController.getAllWorkspaces.bind(this.workspaceController)
            )
            .get(
                routes.workspace.getById,
                { preHandler },
                this.workspaceController.getWorkspaceById.bind(this.workspaceController)
            )
            .patch(
                routes.workspace.updateById,
                { preHandler },
                this.workspaceController.updateWorkspaceById.bind(this.workspaceController)
            )
            .patch(
                routes.workspace.archiveById,
                { preHandler },
                this.workspaceController.archiveWorkspaceById.bind(this.workspaceController)
            )
            .patch(
                routes.workspace.unarchiveById,
                { preHandler },
                this.workspaceController.unarchiveWorkspaceById.bind(this.workspaceController)
            )
    }
}
