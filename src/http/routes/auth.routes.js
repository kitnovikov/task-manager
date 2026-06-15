export default class AuthRoutes {
    constructor(app) {
        this.app = app
        this.authControllers = app.container.authControllers
    }

    register() {
        this.app
            .post('/api/signin', this.authControllers.login.bind(this.authControllers))
            .post('/api/signup', this.authControllers.registration.bind(this.authControllers))
    }
}