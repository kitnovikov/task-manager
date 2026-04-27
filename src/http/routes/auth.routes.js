export default class AuthRoutes {
    constructor(app) {
        this.app = app
        this.authControllers = app.container.authControllers
    }

    register() {
        this.app
            .post('/signin', this.authControllers.signIn.bind(this.authControllers))
            .post('/signup', this.authControllers.signUp.bind(this.authControllers))
    }
}