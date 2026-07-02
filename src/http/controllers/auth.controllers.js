import RegisterUserRequestDto from "../../auth/dto/auth/register.user.request.dto.js";
import RegistrationResponseDto from "../../auth/dto/auth/registration.response.dto.js";
import TokensResponseDto from "../../auth/dto/tokens/tokens.response.dto.js";
import LoginRequestDto from "../../auth/dto/auth/login.request.dto.js";
import EmailActivateTokenDto from "../../auth/dto/mail/email.activate.token.dto.js";

export default class AuthControllers {
    constructor(authService, emailConfirmationService) {
        this.authService = authService
        this.emailConfirmationService = emailConfirmationService
    }

    async login(req, res) {
        const tokens = await this.authService.login(new LoginRequestDto(req.body))

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
        res.code(200).send(new TokensResponseDto(tokens))
    }

    async registration(req, res) {
        const result = await this.authService.registration(new RegisterUserRequestDto(req.body))

        res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
        res.code(201).send(new RegistrationResponseDto(result))
    }
}
