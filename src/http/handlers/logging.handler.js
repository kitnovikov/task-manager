import {requestContext} from "../../logging/request-context.js";

const setupLoggingHandler = (app) => {
    const { logger } = app.container

    const getRequestMeta = (req) => ({
        requestId: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        userId: req.user?.id,
        service: 'http-request',
    })

    app.addHook('onRequest', (req, res, done) => {
        req.requestStartedAt = performance.now()

        requestContext.run({ requestId: req.id }, () => {
            logger.info('Request received', getRequestMeta(req))

            done()
        })
    })

    app.addHook('onResponse', (req, res, done) => {
        const durationMs = req.requestStartedAt
            ? performance.now() - req.requestStartedAt
            : undefined

        logger.info('Request completed', {
            ...getRequestMeta(req),
            statusCode: res.statusCode,
            durationMs: Number(durationMs.toFixed(2)) ?? undefined,
        })

        done()
    })
}

export default setupLoggingHandler
