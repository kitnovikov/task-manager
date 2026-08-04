import {mixed, object, string} from 'yup'
import BaseSchema from "../../../lib/schema.base.js";

export default class WorkspaceSchema extends BaseSchema {
    static id = string()
        .strict(true)
        .uuid()


    static name = string()
        .strict(true)
        .min(3, 'Название рабочего пространства должно содержать минимум 3 символа')
        .max(60, 'Название рабочего пространства должно содержать максимум 60 символов')

    static slug = string()
        .strict(true)
        .min(3, 'Ключ рабочего пространства должен содержать минимум 3 символа')
        .max(5, 'Ключ рабочего пространства должен содержать максимум 5 символов')
        .matches(/^[a-zA-Z]+$/, 'Ключ рабочего пространства может содержать только латинские буквы')

    static description = string()
        .strict(true)
        .min(3, 'Описание рабочего пространства должно содержать минимум 3 символа')
        .max(200, 'Описание рабочего пространства должно содержать максимум 200 символов')

    static createWorkspaceSchema = object({
        name: this.name.required('Название рабочего пространства обязательно'),
        slug: this.slug.required('Ключ рабочего пространства обязателен'),
        description: this.description.required('Описание рабочего пространства обязательно'),
    }).noUnknown(true, 'Переданы неизвестные поля')

    static updateWorkspaceSchema = object({
        id: this.id.required(),
        name: this.name,
        slug: this.slug,
        description: this.description,
    }).noUnknown(true, 'Переданы неизвестные поля')
}
