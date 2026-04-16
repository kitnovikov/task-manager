import UserDto from "../dto/user.dto.js";
import InternalServerError from "../errors/internalServer.error.js";
import bcrypt from "bcrypt";
import BadRequestError from "../errors/badRequest.error.js";

export default class AuthService {
    constructor(tokenService, userService, authRepository, logger) {
        this.tokenService = tokenService
        this.userService = userService
        this.authRepository = authRepository
        this.logger = logger
    }

    async signUp(data) {
        const user = await this.userService.createUser(data)
        const tokens = await this.tokenService.createTokens({ ...new UserDto(user) })
        const isSaves = await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        if (!isSaves) {
            this.logger.error(`Failed to save refresh token for user "${user.id}"`)
            throw new InternalServerError()
        }

        return { user, ...tokens }
    }

    async signIn(email, password) {
        const user = await this.userService.getUserByEmailForAuth(email)
        const isPasswordsEquals = await bcrypt.compare(password, user.password)

        if (!isPasswordsEquals) {
            throw new BadRequestError('Email or password incorrect.')
        }

        const tokens = await this.tokenService.createTokens({ ...new UserDto(user) })
        const isSaves = await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        if (!isSaves) {
            throw new InternalServerError()
        }

        return { ...tokens }
    }
}