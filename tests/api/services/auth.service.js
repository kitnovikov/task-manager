import BaseService from "../lib/base.service.js";

export default class AuthService extends BaseService {
    registration(data) {
        return this.client.post('/api/signup', data)
    }

    login(data) {
        return this.client.post('/api/signin', data)
    }
}