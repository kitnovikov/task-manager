export default class PrismaWorkspaceQueryBuilder {
    static buildVisibleWorkspacesByMemberQuery({ userId, memberStatus, visibleArchivedForRoles, visibleWorkspaceStatuses, pagination }) {
        return {
            where: {
                userId,
                status: memberStatus,
                OR: [
                    {
                        role: {
                            in: visibleArchivedForRoles,
                        },
                    },
                    {
                        workspaces: {
                            status: {
                                in: visibleWorkspaceStatuses
                            },
                        },
                    },
                ],
            },
            select: {
                role: true,
                createdAt: true,
                workspaces: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        status: true,
                        ownerId: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: pagination.limit,
            skip: pagination.offset,
        }
    }

    static buildUpdateWorkspaceByIdQuery({ workspaceId, data}) {
        return {
            where: {
                id: workspaceId,
            },
            data: data,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                status: true,
                ownerId: true,
                createdAt: true,
                updatedAt: true,
            }
        }
    }
}