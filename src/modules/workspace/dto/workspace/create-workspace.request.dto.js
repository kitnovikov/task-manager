import {isString} from "../../../../lib/types.js";

export default class CreateWorkspaceRequestDto {
    constructor(data) {
        this.name = isString(data.name) ? data.name.trim() : data.name
        this.slug = isString(data.slug) ? data.slug.trim().toUpperCase() : data.slug
        this.description = data.description
    }
}
