import {isString} from "../../../../lib/types.js";

export default class RegisterUserRequestDto {
    constructor(data) {
        this.firstName = isString(data.firstName) ? data.firstName?.trim() : data.firstName
        this.lastName = isString(data.lastName) ? data.lastName?.trim() : data.lastName
        this.email = isString(data.email) ? data.email?.trim().toLowerCase() : data.email
        this.password = data.password
    }
}