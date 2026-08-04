import pino from "pino";
import {getRequestContext} from "./request-context.js";

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
        this.logger.debug({...obj, ...getRequestContext()}, message)
    }

    info(message, obj) {
        this.logger.info({...obj, ...getRequestContext()}, message)
    }

    warn(message, obj) {
        this.logger.warn({...obj, ...getRequestContext()}, message)
    }

    error(message, obj) {
        this.logger.error({...obj, ...getRequestContext()}, message)
    }

    fatal(message, obj) {
        this.logger.fatal({...obj, ...getRequestContext()}, message)
    }
}