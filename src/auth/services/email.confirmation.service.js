import JwtToken from "./jwt.token.js";
import EmailConfirmationTokenPayloadDto from "../dto/mail/email.confirmation.token.payload.dto.js";

export default class EmailConfirmationService {
    constructor(config, smtp, logger) {
        this.smtp = smtp
        this.jwt = new JwtToken()

        this.domain = config.get('HOST')

        this.jwtEmailConfirmationToken = config.get('JWT_EMAIL_CONFIRMATION_TOKEN')
        this.jwtEmailConfirmationExpiration = config.get('JWT_EMAIL_CONFIRMATION_TOKEN_EXPIRATION')

        this.logger = logger
    }

    async generateVerificationToken(payload) {
        return this.jwt.generate({ ...payload }, this.jwtEmailConfirmationToken, this.jwtEmailConfirmationExpiration)
    }

    async sendActivationMail(user) {
        const token = await this.generateVerificationToken(new EmailConfirmationTokenPayloadDto(user))
        const link = new URL(token, this.domain)

        this.smtp.send(
            user.email,
            'Подтверждение аккаунта',
            `<b>${user.firstName}, привет!</b><p>Спасибо, что воспользовались нашим сервисом!</p><h3>Вот ссылка для подтверждения аккаунта: ${link}</h3>Пожалуйста, перейдите по ней.`
        )
    }
}