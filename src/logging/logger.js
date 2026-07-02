import pino from "pino";

export default class Logger {
    constructor() {
        this.logger = pino({
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                },
            },
            formatters: {
                level: (label) => ({ level: label.toLocaleUpperCase() }),
            },
            timestamp: pino.stdTimeFunctions.isoTime,
        })
    }

    debug(message, obj) {
        this.logger.debug(obj, message)
    }

    info(message, obj) {
        this.logger.info(obj, message)
    }

    warn(message, obj) {
        this.logger.warn(obj, message)
    }

    error(message, obj) {
        this.logger.error(obj, message)
    }

    fatal(message, obj) {
        this.logger.fatal(obj, message)
    }
}