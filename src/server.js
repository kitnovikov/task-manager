import fastify from "fastify"
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import middie from '@fastify/middie'
import pug from 'pug'
import createContainer from "./container.js";
import ConfigService from "./config/config.service.js";
import getAllRoutes from './routes/index.js'
import getAllMiddlewares from './handlers/index.js'
import Logger from "./logger/logger.js";

class App {
    constructor(config) {
        this.config = config
        this.logger = new Logger()
        this.port = this.config.get('PORT')
        this.app = fastify()

        this.registerDependencies()
    }

    registerDependencies() {
        this.logger.debug('Installing server dependencies is in progress')

        this.registerContainer()
        this.registerPlugins() // решить, как использовать await
        this.registerRoutes()
        this.registerMiddlewares()
    }

    registerPlugins() {
        this.app.register(formbody)
        this.app.register(view, { engine: { pug } })
        this.app.register(fastifyCookie)
        // this.app.register(fastifySession, {
        //     secret: 'a secret with minimum length of 32 characters',
        //     cookie: { secure: false },
        // })
    }

    registerContainer() {
        this.app.decorate('container', createContainer(this.config, this.logger))
    }

    registerRoutes() {
        for (const Routes of getAllRoutes) {
            new Routes(this.app).register()
        }
    }

    registerMiddlewares() {
        this.app.register(middie)

        for (const middleware of getAllMiddlewares) {
            middleware(this.app)
        }
    }

    listen() {
        this.app.listen({ port: this.port }, () => {
            this.logger.debug(`Application launched at the address: http://localhost:${this.port}`)
        })
    }
}

const app = await new App(new ConfigService())

app.listen()