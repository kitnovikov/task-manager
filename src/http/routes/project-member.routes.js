import routes from './routes.js';
import authMiddleware from "../middlewares/auth.middleware.js";

export default class ProjectMemberRoutes {
    constructor(app) {
        this.app = app
        this.projectMemberController = app.container.projectMemberController
        this.authorize = authMiddleware(this.app)
    }

    register() {
        const preHandler = [this.authorize]

        this.app
            .post(
                routes.projectMembers.add,
                { preHandler },
                this.projectMemberController.addMember.bind(this.projectMemberController)
            )
            .get(
                routes.projectMembers.getAll,
                { preHandler },
                this.projectMemberController.getMembers.bind(this.projectMemberController)
            )
            .delete(
                routes.projectMembers.remove,
                { preHandler },
                this.projectMemberController.removeMember.bind(this.projectMemberController)
            )
            .patch(
                routes.projectMembers.updateRole,
                { preHandler },
                this.projectMemberController.updateMemberRole.bind(this.projectMemberController)
            )
    }
}
