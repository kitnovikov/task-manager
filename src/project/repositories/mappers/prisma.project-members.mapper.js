import ProjectMemberEntity from "../../entities/project-member.entity.js";

export default function toDomain(entities) {
    if (!entities) {
        return null
    }

    return Array.isArray(entities)
        ? entities.map((member) => new ProjectMemberEntity(member))
        : new ProjectMemberEntity(entities)
}