import JwtToken from "./jwt.token.js"
import EmailConfirmationTokenPayloadDto from "../dto/mail/email.confirmation.token.payload.dto.js"
import BadRequestError from "../../errors/badRequest.error.js";
import NotFoundError from "../../errors/notFound.error.js";

export default class EmailConfirmationService {
    constructor(config, smtp, userService, logger) {
        this.smtp = smtp
        this.jwt = new JwtToken()
        this.jwtEmailConfirmationTokenInfo = {
            secret: config.get('JWT_EMAIL_CONFIRMATION_TOKEN'),
            expiration: config.get('JWT_EMAIL_CONFIRMATION_TOKEN_EXPIRATION'),
        }
        this.userService = userService
        this.logger = logger
    }

    async generateVerificationToken(payload) {
        return this.jwt.generate(
            { ...payload },
            this.jwtEmailConfirmationTokenInfo.secret,
            this.jwtEmailConfirmationTokenInfo.expiration,
        )
    }

    async sendVerificationToken(user) {
        const token = await this.generateVerificationToken(new EmailConfirmationTokenPayloadDto(user))

        this.logger.info('Email verification token generated', {
            userId: user.id,
            token,
            service: 'send-verification-token'
        })

        // TODO: Добавить проверку на лимит в секунду и добавить retry

        this.smtp.send(
            user.email,
            'Подтверждение аккаунта',
            `<b>${user.firstName}, привет!</b><p>Спасибо, что воспользовались нашим сервисом!</p><h3>Вот ссылка для подтверждения аккаунта: ${token}</h3>Пожалуйста, перейдите по ней.`
        )
    }

    async activateEmailByToken(data) {
        const payload = this.jwt.verify(data.token, this.jwtEmailConfirmationTokenInfo.secret)

        if (!payload) {
            this.logger.error('Email verification token incorrect', {
                token: data.token,
                service: 'activate-email-by-token'
            })
            throw new BadRequestError('Email verification token incorrect')
        }

        const user = await this.userService.getUserById(payload.id)

        if (user.isVerified()) {
            this.logger.debug('User is already confirmed', {
                userId: user.id,
                emailVerifiedAt: user.emailVerifiedAt,
                service: 'activate-email-by-token'
            })
            throw new BadRequestError('User is already confirmed')
        }

        if (!user.isActive()) {

            this.logger.debug('User is not active', {
                user: {
                    id: user.id,
                    status: user.status,
                },
                service: 'activate-email-by-token'
            })
            throw new NotFoundError('User not found')
        }

        const updatedUser = await this.userService.update(user.id, {
            emailVerifiedAt: new Date()
        })

        this.logger.debug('Email is active', {
            userId: updatedUser.id,
            emailVerifiedAt: updatedUser.emailVerifiedAt,
            service: 'activate-email-by-token'
        })

        return updatedUser
    }
}
