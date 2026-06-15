import UserSchema from "../validation/user.schema.js";
import BadRequestError from "../../errors/badRequest.error.js";
import { encrypt } from "../../utils.js";
import CreateUserDto from "../dto/user/create-user.dto.js";

export default class UserService {
    constructor(userRepository, logger) {
        this.userRepository = userRepository
        this.logger = logger
    }

    // async getUserById(id) {
    //     await UserSchema.validator(UserSchema.schemaId, id)
    //     const user = await this.userRepository.findOne({ id, status: 'Active' })
    //
    //     if (!user) {
    //         this.logging.error(`User not found "${id}"`)
    //         throw new NotFoundError('User not found')
    //     }
    //
    //     return user
    // }

    async getUserByEmailForAuth(email) {
        return this.userRepository.findByEmail(email)
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

    // async updateById(id, data) {
    //     await UserSchema.validator(UserSchema.updateUserSchema, { id, ...data })
    //
    //     const isUserExist = await this.userRepository.findOne({ id, status: 'Active' })
    //     if (!isUserExist) {
    //         throw new NotFoundError('User not found')
    //     }
    //
    //     if (data.password) {
    //         data.password = await encrypt(data.password)
    //     }
    //
    //     return this.userRepository.update(id, data)
    // }
    //
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