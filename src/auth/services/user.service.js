import UserSchema from "../validation/user.schema.js";
import BadRequestError from "../../errors/badRequest.error.js";
import { encrypt } from "../../utils.js";
import CreateUserDto from "../dto/user/create-user.dto.js";
import NotFoundError from "../../errors/notFound.error.js";

export default class UserService {
    constructor(userRepository, logger) {
        this.userRepository = userRepository
        this.logger = logger
    }

    async getUserById(id) {
        await UserSchema.validator(UserSchema.id, id)

        const user = await this.userRepository.findById(id)

        if (!user) {
            this.logger.debug(`User not found "${id}"`, {
                service: 'get-user-by-id'
            })
            throw new NotFoundError('User not found')
        }

        this.logger.debug(`User found "${id}"`, {
            service: 'get-user-by-id'
        })

        return user
    }

    async getUserByEmail(email) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            this.logger.debug('User not found', {
                email: email,
                service: 'get-user-by-email'
            })

            throw new NotFoundError('User not found')
        }

        this.logger.debug(`User found`, {
            email: email,
            service: 'get-user-by-email'
        })

        return user
    }

    async createUser(data) {
        await UserSchema.validator(UserSchema.userRegistrationSchema, data)

        const isUserExist = await this.userRepository.findByEmail(data.email)

        if (isUserExist) {
            this.logger.error(`User with email: "${data.email}" is exist`, {
                module: 'create-user'
            })
            throw new BadRequestError('User with this email already exists')
        }

        this.logger.debug(`User with email: "${data.email}" is not exist`, {
            module: 'create-user'
        })

        const newUser = await this.userRepository.save(new CreateUserDto({
            ...data,
            password: await encrypt(data.password)
        }));

        this.logger.info('User created', {
            user: newUser,
            module: 'create-user'
        })

        return newUser
    }

    async update(id, data) {
        // await UserSchema.validator(UserSchema.updateUserSchema, { id, ...data })

        const isUserExist = await this.userRepository.findById(id)
        if (!isUserExist) {
            throw new NotFoundError('User not found')
        }

        return this.userRepository.update(id, data)
    }

    // async deleteById(id) {
    //     await UserSchema.validator(UserSchema.schemaId, id)
    //
    //     const isUserExist = await this.userRepository.findOne({ id, status: 'Active' })
    //
    //     if (!isUserExist) {
    //         this.logging.error(`User not found "${id}"`)
    //         throw new NotFoundError('User not found')
    //     }
    //
    //     const deletedUser = await this.userRepository.update(id, { status: 'Archived' })
    //     this.logging.info(`User deleted "${id}"`)
    //
    //     return deletedUser
    // }
}