import jwt from 'jsonwebtoken'
import JwtToken from "./jwt.token.js";

export default class TokenService {
    constructor(config, tokenRepository, logger) {
        this.config = config
        this.jwtTokenService = new JwtToken()

        this.jwtAccessToken = this.config.get('JWT_AUTH_ACCESS_TOKEN')
        this.accessTokenExpiration = this.config.get('JWT_AUTH_ACCESS_TOKEN_EXPIRATION')

        this.jwtRefreshToken = this.config.get('JWT_AUTH_REFRESH_TOKEN')
        this.refreshTokenExpiration = this.config.get('JWT_AUTH_REFRESH_TOKEN_EXPIRATION')

        this.tokenRepository = tokenRepository
        this.logger = logger
    }

    async createTokens(payload) {
        const accessToken = this.jwtTokenService.generate({ ...payload }, this.jwtAccessToken, this.accessTokenExpiration)
        const refreshToken = this.jwtTokenService.generate({ ...payload }, this.jwtRefreshToken, this.refreshTokenExpiration)

        // if (!accessToken || !refreshToken) {
            // TODO: Создать ошибку создания токенов
        // }

        this.logger.info(`Refresh and access tokens generated`, {
            user: payload,
            tokens: { accessToken, refreshToken },
            service: 'create-token'
        })

        return { accessToken, refreshToken }
    }

    async saveRefreshToken(userId, refreshToken) {
        const isExist = await this.tokenRepository.findByUserId(userId)

        if (isExist) {
            const updatedToken = await this.tokenRepository.update(userId, refreshToken)
            this.logger.info(`Refresh token updated`, {
                userId, refreshToken,
                service: 'save-token'
            })
            return updatedToken
        }

        this.logger.debug(`Refresh token not found`, {
            userId,
            service: 'save-token'
        })

        const token = await this.tokenRepository.save(userId, refreshToken)
        this.logger.info(`Refresh token saved`, {
            token,
            service: 'save-token'
        })

        return token
    }

    verifyAccessToken(token) {
        return this.jwtTokenService.verify(token, this.jwtAccessToken)
    }
}