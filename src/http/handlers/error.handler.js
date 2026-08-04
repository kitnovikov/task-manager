import InternalServerError from "../errors/internalServer.error.js";

const setupErrorHandler = (app) => {
    const { logger } = app.container

    app.setErrorHandler((error, req, res) => {
        if (error.statusCode) {
            logger.warn('Request failed with handled error', {
                statusCode: error.statusCode,
                error: error.name,
                method: req.method,
                url: req.url,
                service: 'error-handler',
            })

            return res.code(error.statusCode).send({
                statusCode: error.statusCode,
                error: error.error ?? error.name,
                message: error.messages ?? error.message,
            })
        }

        logger.error('Unhandled request error', {
            err: error,
            method: req.method,
            url: req.url,
            service: 'error-handler',
        })

        const errorResponse = new InternalServerError()
        return res.code(errorResponse.statusCode).send(errorResponse)
    })
}

export default setupErrorHandler
