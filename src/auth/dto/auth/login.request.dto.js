import {isString} from "../../../lib/types.js";

export default class LoginRequestDto {
    constructor(data) {
        this.email = isString(data.email) ? data.email?.trim().toLowerCase() : data.email
        this.password = data.password
    }
}