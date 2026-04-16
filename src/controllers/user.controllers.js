export default class UserControllers {
    constructor(userService) {
        this.userService = userService
    }

    async getUserById(req, res) {
        const { id } = req.params

        const user = await this.userService.getUserById(id)
        res.code(200).send({ ...user })
    }

    async updateById(req, res) {
        const { id } = req.params
        const body = req.body

        const user = await this.userService.updateById(id, body)

        res.code(201).send({ ...user })
    }

    async deleteById(req, res) {
        const { id } = req.params

        await this.userService.deleteById(id)

        res.code(200).send({ statusCode: 200, message: 'User deleted successfully.' })
    }
}