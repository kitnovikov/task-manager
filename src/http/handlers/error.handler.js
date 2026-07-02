import InternalServerError from "../../errors/internalServer.error.js";

const setupErrorHandler = (app) => {
    const { logger } = app.container

    app.setErrorHandler((error, req, res) => {
        if (error.statusCode) {
            return res.code(error.statusCode).send({
                statusCode: error.statusCode,
                error: error.error ?? error.name,
                message: error.messages ?? error.message,
            })
        }

        logger.error('Error', { err: error })

        const errorResponse = new InternalServerError()
        return res.code(errorResponse.statusCode).send({ ...errorResponse})
    })
}

export default setupErrorHandler