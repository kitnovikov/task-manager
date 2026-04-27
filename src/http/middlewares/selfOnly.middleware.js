import ForbiddenError from "../../errors/forbidden.error.js";

const selfOnlyMiddleware = (app) => {
    const { logger } = app.container
    const loggerModule = logger.setModule('self-only')

    return (req, res, next) => {
        const currenUserId = req.user.id
        const targetUserId = req.params.id

        if (currenUserId !== targetUserId) {
            loggerModule.error(`User ${currenUserId} tried to delete account ${targetUserId} — forbidden`)
            throw new ForbiddenError('You can delete only your own account.')
        }

        next()
    }
}

export default selfOnlyMiddleware