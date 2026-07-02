import AuthService from "./auth.service.js";
import UserService from "./user.service.js";

export default class API {
    constructor(client) {
        this.client = client

        this.authService = new AuthService(this.client)
        this.userService = new UserService(this.client)
    }
}