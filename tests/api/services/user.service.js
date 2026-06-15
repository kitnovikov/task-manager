import BaseService from "../lib/base.service.js";

export default class UserService extends BaseService {
    deleteById(id) {
        return this.client.delete(`/users/${id}`)
    }
}