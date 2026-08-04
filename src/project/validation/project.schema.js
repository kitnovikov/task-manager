import { string, object } from 'yup'
import BaseSchema from "../../lib/schema.base.js";

export default class ProjectSchema extends BaseSchema {
    static id = string()
        .required('Идентификатор проекта обязателен')
        .uuid('Идентификатор проекта должен быть UUID')

    static name = string()
        .required('Название проекта обязательно')
        .strict(true)
        .min(3, 'Название проекта должно содержать минимум 3 символа')
        .max(30, 'Название проекта должно содержать максимум 30 символов')

    static description = string()
        .required('Описание проекта обязательно')
        .strict(true)
        .min(3, 'Описание проекта должно содержать минимум 3 символа')
        .max(100, 'Описание проекта должно содержать максимум 100 символов')

    static createdBy = string()
        .required('Идентификатор автора проекта обязателен')
        .uuid('Идентификатор автора проекта должен быть UUID')

    static createProjectSchema = object({
        name: this.name,
        description: this.description,
        createdBy: this.createdBy,
    }).noUnknown(true, 'Переданы неизвестные поля')
}
