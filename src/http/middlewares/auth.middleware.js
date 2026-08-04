import UnauthorizedError from "../errors/unauthorized.error.js";

const authMiddleware = (app) => {
    const { tokenService, logger } = app.container

    return (req, res, next) => {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            logger.warn('Authorization header is missing or invalid', {
                method: req.method,
                url: req.url,
                service: 'auth-middleware',
            })
            throw new UnauthorizedError('Требуется авторизация')
        }

        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) {
            logger.warn('Access token is missing', {
                method: req.method,
                url: req.url,
                service: 'auth-middleware',
            })
            throw new UnauthorizedError('Токен доступа отсутствует')
        }

        const payload = tokenService.verifyAccessToken(accessToken)
        if (!payload) {
            logger.warn('Access token is invalid or expired', {
                method: req.method,
                url: req.url,
                service: 'auth-middleware',
            })
            throw new UnauthorizedError('Токен доступа недействителен или истек')
        }

        logger.debug('Access token verified', {
            userId: payload.id,
            method: req.method,
            url: req.url,
            service: 'auth-middleware',
        })
        req.user = payload
        next()
    }
}

export default authMiddleware
