import {WorkspaceStatusesEnum} from "./workspace-statuses.enum.js";

export default class WorkspaceEntity {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.slug = data.slug
        this.description = data.description
        this.status = data.status
        this.ownerId = data.ownerId
        this.createdAt = data.createdAt
        this.updatedBy = data.updatedBy
        this.updatedAt = data.updatedAt
        this.archivedBy = data.archivedBy
        this.archivedAt = data.archivedAt
    }

    isActive() {
        return this.status === WorkspaceStatusesEnum.Active
    }

    isArchived() {
        return this.status === WorkspaceStatusesEnum.Archived
    }
}