import routes from './routes.js';

export default class AuthRoutes {
    constructor(app) {
        this.app = app
        this.authControllers = app.container.authControllers
    }

    register() {
        this.app
            .post(
                routes.auth.login,
                this.authControllers.login.bind(this.authControllers)
            )
            .post(
                routes.auth.registration,
                this.authControllers.registration.bind(this.authControllers)
            )
    }
}
