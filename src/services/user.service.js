import UserSchema from "../validation/user.schema.js";
import NotFoundError from "../errors/notFound.error.js";
import BadRequestError from "../errors/badRequest.error.js";
import { encrypt } from "../utils.js";

export default class UserService {
    constructor(userRepository, logger) {
        this.userRepository = userRepository
        this.logger = logger
    }

    async getUserById(id) {
        await UserSchema.validator(UserSchema.schemaId, id)
        const user = await this.userRepository.findOne({ id, status: 'Active' })

        if (!user) {
            this.logger.error(`User not found ${id}`)
            throw new NotFoundError('User not found.')
        }

        return user
    }

    async getUserByEmailForAuth(email) {
        const user = await this.userRepository.findByEmailForAuth({ email, status: 'Active' })

        if (!user) {
            this.logger.error(`User not found "${email}"`)
            throw new BadRequestError('Email or password incorrect.')
        }

        return user
    }

    async createUser(data) {
        await UserSchema.validator(UserSchema.createUserSchema, data)

        const isUserExist = await this.userRepository.findOne({ email: data.email })

        if (isUserExist) {
            this.logger.error(`User with email: ${data.email} is exist`)
            throw new BadRequestError('User with this email already exists')
        }

        const hashPassword = await encrypt(data.password)
        const user = await this.userRepository.create({ ...data, password: hashPassword });
        this.logger.info(`User created: ${user.id}`)

        return user
    }

    async updateById(id, data) {
        await UserSchema.validator(UserSchema.updateUserSchema, { id, ...data })

        const isUserExist = await this.userRepository.findOne({ id, status: 'Active' })
        if (!isUserExist) {
            throw new NotFoundError('User not found.')
        }

        if (data.password) {
            data.password = await encrypt(data.password)
        }

        return this.userRepository.update(id, data)
    }

    async deleteById(id) {
        await UserSchema.validator(UserSchema.schemaId, id)

        const isUserExist = await this.userRepository.findOne({ id, status: 'Active' })

        if (!isUserExist) {
            this.logger.error(`User not found ${id}`)
            throw new NotFoundError('User not found.')
        }

        const deletedUser = await this.userRepository.update(id, { status: 'Archived' })
        this.logger.info(`User deleted ${id}`)

        return deletedUser
    }
}