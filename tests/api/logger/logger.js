import pino from "pino";

export default class Logger {
    levels = {
        info: 'info',
        error: 'error',
        fatal: 'fatal',
    }

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

    log(level, message) {
        this.logger[level](message)
    }

    info(message) {
        this.log(this.levels.info, message)
    }

    error(message) {
        this.log(this.levels.error, message)
    }

    fatal(message) {
        this.log(this.levels.fatal, message)
    }
}