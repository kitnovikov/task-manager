export default class UserRepository {
    constructor(database) {
        this.database = database
    }

    create(props) {
        return this.database.client.user.create({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            },
            data: { ...props }
        })
    }

    findOne(props) {
        return this.database.client.user.findFirst({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            },
            where: { ...props }
        })
    }

    findByEmailForAuth(props) {
        return this.database.client.user.findFirst({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
            },
            where: { ...props }
        })
    }

    update(id, props) {
        return this.database.client.user.update({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            },
            where: { id },
            data: { ...props }
        })
    }
}