import ForbiddenError from "../http/errors/forbidden.error.js";
import BasePolicy from "./base.policy.js";

export default class BaseGuard {
    // static assertIsVerifiedUser(user) {
    //     if (!BasePolicy.isVerifiedUser(user)) {
    //         throw new ForbiddenError('Чтобы совершать операции, нужно подтвердить почту')
    //     }
    // }
}