import BaseService from "../lib/base.service.js";

export default class AuthService extends BaseService {
    registration(data) {
        return this.client.post('/api/auth/registration', data)
    }

    login(data) {
        return this.client.post('/api/auth/login', data)
    }
}