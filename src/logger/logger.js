import pino from "pino";

export default class Logger {
    constructor() {
        this.logger = pino({
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: "SYS:standard"
                }
            },
            formatters: {
                level: (label) => ({ level: label.toLocaleUpperCase() })
            },
        })
    }

    setModule(name) {
        return this.logger.child({ module: name })
    }

    debug(message) {
        this.logger.debug({ message })
    }

    info(message) {
        this.logger.info({ message })
    }

    error(message) {
        this.logger.error({ message })
    }

    fatal(message) {
        this.logger.fatal({ message })
    }
}