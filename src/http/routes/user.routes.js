import authMiddleware from "../middlewares/auth.middleware.js";

export default class UserRoutes {
    constructor(app) {
        this.app = app
        this.userControllers = app.container.userControllers
        this.authorize = authMiddleware(this.app)
    }

    register() {
        const preHandler = [this.authorize]

        this.app
            .get(
                '/users/:id',
                { preHandler },
                this.userControllers.getUserById.bind(this.userControllers)
            )
            .patch(
                '/users/:id',
                { preHandler },
                this.userControllers.updateById.bind(this.userControllers)
            )
            .delete(
                '/users/:id',
                { preHandler },
                this.userControllers.deleteById.bind(this.userControllers)
            )
    }
}
