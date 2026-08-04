import { string, object } from 'yup'
import BaseSchema from "../../lib/schema.base.js";
import {ProjectMemberRoles} from "../entities/project-member-roles.js";

export default class ProjectMembersSchema extends BaseSchema {
    static projectId = string()
        .required('Идентификатор проекта обязателен')
        .uuid('Идентификатор проекта должен быть UUID')

    static userId = string()
        .required('Идентификатор пользователя обязателен')
        .uuid('Идентификатор пользователя должен быть UUID')

    static currentUserId = string()
        .required('Идентификатор текущего пользователя обязателен')
        .uuid('Идентификатор текущего пользователя должен быть UUID')

    static role = string()
        .required('Роль участника проекта обязательна')
        .oneOf(
            Object.values(ProjectMemberRoles),
            'Роль участника проекта должна быть Owner, Admin или Member'
        )

    static addProjectMemberSchema = object({
        projectId: this.projectId,
        userId: this.userId,
        currentUserId: this.currentUserId,
    }).noUnknown(true, 'Переданы неизвестные поля')

    static removeProjectMemberSchema = object({
        projectId: this.projectId,
        userId: this.userId,
        currentUserId: this.currentUserId,
    }).noUnknown(true, 'Переданы неизвестные поля')

    static updateMemberRoleSchema = object({
        projectId: this.projectId,
        userId: this.userId,
        currentUserId: this.currentUserId,
        role: this.role
    }).noUnknown(true, 'Переданы неизвестные поля')
}
