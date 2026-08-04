import RegisterUserRequestDto from "../../modules/auth/dto/auth/register.user.request.dto.js";
import RegistrationResponseDto from "../../modules/auth/dto/auth/registration.response.dto.js";
import TokensResponseDto from "../../modules/auth/dto/tokens/tokens.response.dto.js";
import LoginRequestDto from "../../modules/auth/dto/auth/login.request.dto.js";
import EmailActivateTokenDto from "../../modules/auth/dto/mail/email.activate.token.dto.js";

export default class TaskController {
    constructor() {
    }

    async createProject(req, res) {
        res.code(201).send('done')
    }
}
