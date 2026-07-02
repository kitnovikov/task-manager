import UserEntity from "../../entities/user.entity.js";

export default function toDomain(user) {
    return user ? new UserEntity(user) : null
}