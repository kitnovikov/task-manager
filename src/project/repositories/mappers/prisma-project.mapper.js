import ProjectEntity from "../../entities/project.entity.js";

export default function toDomain(data) {
    if (!data) {
        return null
    }

    return Array.isArray(data)
        ? data.map((project) => new ProjectEntity(project))
        : new ProjectEntity(data)
}