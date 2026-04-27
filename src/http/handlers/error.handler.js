import InternalServerError from "../../errors/internalServer.error.js";

const setupErrorHandler = (app) => {
    app.setErrorHandler((error, req, res) => {
        if (error.statusCode) {
            return res.code(error.statusCode).send(error)
        }

        console.log('Error:' , error)
        res.code(500).send({ ...new InternalServerError()})
    })
}

export default setupErrorHandler