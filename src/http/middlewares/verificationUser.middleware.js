import ForbiddenError from "../errors/forbidden.error.js";

const verificationUserMiddleware = (app) => {
    const { userRepository, logger } = app.container

    return async (req, res) => {
        const user = await userRepository.findById(req.user.id)

        if (!user.isVerified()) {
            throw new ForbiddenError('Чтобы совершать операции, нужно подтвердить почту')
        }

        if (user.isArchived()) {
            throw new ForbiddenError('Ваша учетная запись находится в архиве')
        }
    }
}

export default verificationUserMiddleware
