import TokenPayloadDto from "../dto/tokens/token.payload.dto.js";
import InternalServerError from "../../../http/errors/internalServer.error.js";
import bcrypt from "bcrypt";
import BadRequestError from "../../../http/errors/badRequest.error.js";

export default class AuthService {
    constructor(tokenService, userService, mailService, logger) {
        this.tokenService = tokenService
        this.userService = userService
        this.mailService = mailService
        this.logger = logger
    }

    async registration(data) {
        this.logger.debug('User registration started', {
            email: data.email,
            service: 'user-registration',
        })

        const user = await this.userService.createUser(data)

        if (!user) {
            this.logger.error('User registration failed because user was not created', {
                email: data.email,
                service: 'user-registration',
            })
            throw new InternalServerError()
        }

        const tokens = await this.tokenService.createTokens({ ...new TokenPayloadDto(user) })
        const isSaves = await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        if (!isSaves) {
            this.logger.error('Failed to save refresh token', {
                userId: user.id,
                service: 'user-registration'
            })
            throw new InternalServerError()
        }

        this.mailService.sendVerificationToken(user)

        this.logger.info('User registration completed', {
            userId: user.id,
            email: user.email,
            service: 'user-registration',
        })

        return { user, tokens }
    }

    async login(data) {
        this.logger.debug('User login started', {
            email: data.email,
            service: 'user-authentication',
        })

        const user = await this.userService.getUserByEmail(data.email)

        // throw new BadRequestError('Email or password incorrect')

        const isPasswordsEquals = await bcrypt.compare(data.password, user.password)

        if (!isPasswordsEquals) {
            this.logger.debug('Password incorrect', {
                email: data.email,
                service: 'user-authentication'
            })

            throw new BadRequestError('Неверный email или пароль')
        }

        this.logger.debug('Password correct', {
            userId: user.id,
            service: 'user-authentication'
        })

        const tokens = await this.tokenService.createTokens(new TokenPayloadDto(user))
        const isSaves = await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        if (!isSaves) {
            this.logger.error('Failed to save refresh token', {
                userId: user.id,
                service: 'user-authentication',
            })
            throw new InternalServerError()
        }

        this.logger.info('User login completed', {
            userId: user.id,
            service: 'user-authentication',
        })

        return tokens
    }
}
