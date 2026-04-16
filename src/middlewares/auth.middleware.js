import UnauthorizedError from "../errors/unauthorized.error.js";

const authMiddleware = (app) => {
    const { tokenService, logger } = app.container
    const loggerModule = logger.setModule('token-verify')

    return (req, res, next) => {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new UnauthorizedError('Authentication required.')
        }

        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) {
            throw new UnauthorizedError('Access token is missing.')
        }

        const payload = tokenService.verifyAccessToken(accessToken)
        if (!payload) {
            throw new UnauthorizedError('Invalid or expired access token.')
        }

        loggerModule.info(`Verify access token for user ${payload.id}`)
        req.user = payload
        next()
    }
}

export default authMiddleware
