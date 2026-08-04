import fastify from "fastify"
import crypto from 'node:crypto'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import middie from '@fastify/middie'
import pug from 'pug'
import path from 'node:path'
import createContainer from "./container.js";
import ConfigService from "./config/config.service.js";
import getAllRoutes from './http/routes/index.js'
import getAllMiddlewares from './http/handlers/index.js'
import Logger from "./logging/logger.js";

class App {
    constructor(config) {
        this.config = config
        this.logger = new Logger()
        this.host = this.config.get('HOST')
        this.port = this.config.get('PORT')
        this.options = {
            genReqId: (req) => crypto.randomUUID(),
            routerOptions: {
                maxParamLength: 1000,
            },
        }

        this.app = fastify(this.options)

        this.registerDependencies()
    }

    registerDependencies() {
        this.logger.info('Installing server dependencies is in progress', {
            service: 'server',
        })

        this.registerContainer()
        this.registerPlugins() // решить, как использовать await
        this.registerRoutes()
        this.registerMiddlewares()
    }

    registerPlugins() {
        this.app.register(formbody)
        this.app.register(view, {
            engine: { pug },
            root: path.resolve('src/http/views'),
        })
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

    async listen() {
        try {
            await this.app.listen({ port: this.port })
            this.logger.info('Application launched', {
                host: this.host,
                port: this.port,
                service: 'server',
            })
        } catch (error) {
            this.logger.fatal('Server error', {
                err: error,
                service: 'server',
            })
        }
    }
}

const app = await new App(new ConfigService())

await app.listen()
