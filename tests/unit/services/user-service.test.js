import {describe, expect, test} from "@jest/globals";
import UserService from "../../../src/auth/services/user.service.js";

class MockUserRepository {
    constructor() {
        this.users = []
    }

    findOne(data) {
        return this.users.find()
    }


}

describe('User Service', () => {
    const userRepository = new MockUserRepository()
    const userService = new UserService(userRepository)

    describe('getUserById', () => {
        test('UserNotFound', async () => {
            // Добавить проверку на instance UserNotFound
            expect(async () => await userService.getUserById()).toThrow('User not found.')
        })

        test('ValidationError', async () => {
            expect(async () => await userService.getUserById()).toThrow('User not found.')
        })

        test('User is find', async () => {
            const user = await userService.getUserById()
        })
    })
})