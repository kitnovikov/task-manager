import EmailActivateTokenDto from "../../auth/dto/mail/email.activate.token.dto.js";

export default class EmailConfirmationController {
    constructor(emailConfirmationService) {
        this.emailConfirmationService = emailConfirmationService
    }

    async activateEmail(req, res) {
        await this.emailConfirmationService.activateEmailByToken(new EmailActivateTokenDto(req.body))

        res.code(200).send({ message: 'Email activate' })
    }
}