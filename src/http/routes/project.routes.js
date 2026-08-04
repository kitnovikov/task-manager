import routes from './routes.js';
import authMiddleware from "../middlewares/auth.middleware.js";

export default class ProjectRoutes {
    constructor(app) {
        this.app = app
        this.projectController = app.container.projectController
        this.authorize = authMiddleware(this.app)
    }

    register() {
        const preHandler = [this.authorize]

        this.app
            .post(
                routes.project.create,
                { preHandler },
                this.projectController.create.bind(this.projectController)
            )
            .get(
                routes.project.getById,
                { preHandler },
                this.projectController.getById.bind(this.projectController)
            )
            .get(
                routes.project.create,
                { preHandler },
                this.projectController.getAll.bind(this.projectController)
            )
    }
}
