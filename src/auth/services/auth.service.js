import TokenPayloadDto from "../dto/tokens/token.payload.dto.js";
import InternalServerError from "../../errors/internalServer.error.js";
import bcrypt from "bcrypt";
import BadRequestError from "../../errors/badRequest.error.js";

export default class AuthService {
    constructor(tokenService, userService, mailService, logger) {
        this.tokenService = tokenService
        this.userService = userService
        this.mailService = mailService
        this.logger = logger
    }

    async registration(data) {
        const user = await this.userService.createUser(data)

        if (!user) {
            throw new InternalServerError()
        }

        const tokens = await this.tokenService.createTokens({ ...new TokenPayloadDto(user) })
        const isSaves = await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        if (!isSaves) {
            this.logger.error(`Failed to save refresh token`, {
                userId: user.id,
                service: 'user-registration'
            })
            throw new InternalServerError()
        }

        this.mailService.sendVerificationToken(user)

        return { user, tokens }
    }

    async login(data) {
        const user = await this.userService.getUserByEmail(data.email)

        // throw new BadRequestError('Email or password incorrect')

        const isPasswordsEquals = await bcrypt.compare(data.password, user.password)

        if (!isPasswordsEquals) {
            this.logger.debug('Password incorrect', {
                email: data.email,
                service: 'user-authentification'
            })

            throw new BadRequestError('Email or password incorrect')
        }

        this.logger.debug('Password correct', {
            email: data.email,
            service: 'user-authentification'
        })

        const tokens = await this.tokenService.createTokens(new TokenPayloadDto(user))
        const isSaves = await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        if (!isSaves) {
            throw new InternalServerError()
        }

        return tokens
    }
}