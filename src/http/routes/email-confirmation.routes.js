import routes from './routes.js';

export default class EmailConfirmationRoutes {
    constructor(app) {
        this.app = app
        this.emailConfirmationControllers = app.container.emailConfirmationControllers
    }

    register() {
        this.app
            .post(
                routes.emailConfirmation.activeVerificationToken,
                this.emailConfirmationControllers.activateEmail.bind(this.emailConfirmationControllers)
            )
    }
}
