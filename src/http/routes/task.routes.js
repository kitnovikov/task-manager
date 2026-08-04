import routes from './routes.js'

export default class TaskRoutes {
    constructor(app) {
        this.app = app
        this.taskController = app.container.taskController
    }

    register() {
    }
}