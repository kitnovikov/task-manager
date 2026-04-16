import authMiddleware from "../middlewares/auth.middleware.js";
import selfOnlyMiddleware from "../middlewares/selfOnly.middleware.js";

export default class UserRoutes {
    constructor(app) {
        this.app = app
        this.userControllers = app.container.userControllers
        this.authorize = authMiddleware(this.app)
        this.selfOnly = selfOnlyMiddleware(this.app)
    }


    register() {
        this.app
            .get('/users/:id', { preHandler: [ this.authorize ] }, this.userControllers.getUserById.bind(this.userControllers))
            .patch('/users/:id', { preHandler: [ this.authorize, this.selfOnly ] }, this.userControllers.updateById.bind(this.userControllers))
            .delete('/users/:id', { preHandler: [ this.authorize, this.selfOnly ] }, this.userControllers.deleteById.bind(this.userControllers))
    }
}