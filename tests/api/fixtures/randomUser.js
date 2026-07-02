import {randomEmail, randomFirstName, randomLastName, randomPassword} from "../helpers/user.helpers.js";

export const randomCorrectUser = () => ({
    firstName: randomFirstName(),
    lastName: randomLastName(),
    email: randomEmail(),
    password: randomPassword(),
})