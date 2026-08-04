export default class BasePolicy {
    static isVerifiedUser(user) {
        return user?.isVerified === true
    }
}