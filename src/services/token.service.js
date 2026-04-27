import jwt from 'jsonwebtoken'

export default class TokenService {
    constructor(config, tokenRepository, logger) {
        this.config = config

        this.jwtAccessToken = this.config.get('JWT_ACCESS_TOKEN')
        this.accessTokenExpiration = this.config.get('JWT_ACCESS_TOKEN_EXPIRATION')

        this.jwtRefreshToken = this.config.get('JWT_REFRESH_TOKEN')
        this.refreshTokenExpiration = this.config.get('JWT_REFRESH_TOKEN_EXPIRATION')

        this.tokenRepository = tokenRepository
        this.logger = logger
    }

    async createTokens(payload) {
        const accessToken = jwt.sign(payload, this.jwtAccessToken, { expiresIn: this.accessTokenExpiration })
        const refreshToken = jwt.sign(payload, this.jwtRefreshToken, { expiresIn: this.refreshTokenExpiration })

        this.logger.info(`Refresh and access tokens for user "${payload.id}" generated`)

        return { accessToken, refreshToken }
    }

    async saveRefreshToken(userId, refreshToken) {
        const isExist = await this.tokenRepository.findOne({ userId })

        if (isExist) {
            const updatedToken = await this.tokenRepository.update(userId, refreshToken)
            this.logger.info(`Refresh token for user "${userId}" has been updated in database`)
            return updatedToken
        }

        const token = this.tokenRepository.create(userId, refreshToken)
        this.logger.info(`Refresh token for user "${userId}" saved in database`)

        return token
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.jwtAccessToken)
        } catch (error) {
            return null
        }
    }
}