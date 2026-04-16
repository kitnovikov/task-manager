import UnauthorizedError from "../errors/unauthorized.error.js";

export default class AuthControllers {
    constructor(authService) {
        this.authService = authService
    }

    async signIn(req, res) {
        const { email, password } = req.body

        const tokens = await this.authService.signIn(email, password)
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
        res.code(200).send({ ...tokens })
    }

    async signUp(req, res) {
        const { user, accessToken, refreshToken } = await this.authService.signUp(req.body)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
        // res.session.userId = user.id
        res.code(201).send({ user, accessToken, refreshToken })
    }
}