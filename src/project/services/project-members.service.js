import NotFoundError from "../../http/errors/notFound.error.js";
import AddProjectMemberDto from "../dto/project-member/add-project-member.dto.js";
import ProjectMembersSchema from "../validation/project-members.schema.js";
import BadRequestError from "../../http/errors/badRequest.error.js";
import {ProjectMemberRoles} from "../entities/project-member-roles.js";
import ForbiddenError from "../../http/errors/forbidden.error.js";

export default class ProjectMembersService {
    constructor(projectMembersRepository, projectRepository, userRepository, logger) {
        this.projectMembersRepository = projectMembersRepository
        this.projectRepository = projectRepository
        this.userRepository = userRepository
        this.logger = logger
    }

    async addMember(data) {
        this.logger.debug('Adding project member started', {
            projectId: data.projectId,
            userId: data.userId,
            currentUserId: data.currentUserId,
            service: 'add-project-member',
        })

        await ProjectMembersSchema.validator(ProjectMembersSchema.addProjectMemberSchema, data)

        const currentUser = await this.projectMembersRepository.findOne(data.projectId, data.currentUserId)

        if (!currentUser) {
            throw new NotFoundError('Проект не найден')
        }

        if (!currentUser.role.canAddProjectMember()) {
            this.logger.warn('Project member add denied', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                hasMembership: Boolean(currentUser),
                service: 'add-project-member',
            })

            throw new ForbiddenError('Не достаточно прав на добавление пользователя')
        }

        this.logger.debug('Project member add permission granted', {
            projectId: data.projectId,
            userId: data.userId,
            currentUser: {
                id: data.currentUserId,
                role: currentUser.role.getRole(),
            },
            service: 'add-project-member',
        })

        const hasMemberInProject = await this.projectMembersRepository.findOne(data.projectId, data.userId)

        if (hasMemberInProject) {
            this.logger.warn('Project member already exists', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                service: 'add-project-member',
            })

            throw new BadRequestError('Пользователь уже является участником проекта')
        }

        const membership = await this.projectMembersRepository.create(
            new AddProjectMemberDto({
                ...data,
                createdBy: data.currentUserId,
                role: ProjectMemberRoles.Member
            })
        )

        this.logger.info('Project member added', {
            membershipId: membership.id,
            projectId: membership.projectId,
            userId: membership.userId,
            createdBy: membership.createdBy,
            role: membership.role.getRole(),
            service: 'add-project-member',
        })

        return membership
    }

    async getMembers(data) {
        const currentUser = await this.projectMembersRepository.findOne(data.projectId, data.currentUserId)

        if (!currentUser) {
            throw new NotFoundError('Проект не найден')
        }

        if (!currentUser.role.canGetProjectMembers()) {
            throw new ForbiddenError('Не достаточно прав на получение участников проекта')
        }

        // TODO: Добавить проверки в весь проект на статус пользователя.
        // Если пользователь забанен, то убирать его из участников проекта

        const members = await this.projectMembersRepository.findAllWithUsers(data.projectId)

        if (members.length === 0) {
            throw new NotFoundError('В проекте нет участников')
        }

        return members
    }

    async removeMember(data) {
        this.logger.debug('Removing project member started', {
            projectId: data.projectId,
            userId: data.userId,
            currentUserId: data.currentUserId,
            service: 'remove-project-member',
        })

        await ProjectMembersSchema.validator(ProjectMembersSchema.removeProjectMemberSchema, data)

        const currentUser = await this.projectMembersRepository.findOne(data.projectId, data.currentUserId)

        if (!currentUser) {
            this.logger.warn('Project member remove failed because current user is not a project member', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                service: 'remove-project-member',
            })

            throw new NotFoundError('Проект не найден')
        }

        if (!currentUser.role.canDeleteProjectMember()) {
            this.logger.warn('Project member remove denied', {
                projectId: data.projectId,
                userId: data.userId,
                currentUser: {
                    id: data.currentUserId,
                    role: currentUser.role.getRole(),
                },
                service: 'remove-project-member',
            })

            throw new ForbiddenError('Не достаточно прав на удаление участника из проекта')
        }

        this.logger.debug('Project member remove permission granted', {
            projectId: data.projectId,
            userId: data.userId,
            currentUser: {
                id: data.currentUserId,
                role: currentUser.role.getRole(),
            },
            service: 'remove-project-member',
        })

        const member = await this.projectMembersRepository.findOne(data.projectId, data.userId)

        if (!member) {
            this.logger.warn('Project member remove failed because target member was not found', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                service: 'remove-project-member',
            })

            throw new NotFoundError('Участник проекта не найден')
        }

        if (member.role.isOwner()) {
            this.logger.warn('Project owner remove denied', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                service: 'remove-project-member',
            })

            throw new ForbiddenError('Нельзя удалить владельца проекта')
        }

        const removeMember = await this.projectMembersRepository.remove(member.id)

        this.logger.info('Project member removed', {
            membershipId: removeMember.id,
            projectId: removeMember.projectId,
            userId: removeMember.userId,
            removedBy: data.currentUserId,
            role: removeMember.role.getRole(),
            service: 'remove-project-member',
        })

        return removeMember
    }

    async updateMemberRole(data) {
        this.logger.debug('Updating project member role started', {
            projectId: data.projectId,
            userId: data.userId,
            currentUserId: data.currentUserId,
            requestedRole: data.role,
            service: 'update-project-member-role',
        })

        await ProjectMembersSchema.validator(ProjectMembersSchema.updateMemberRoleSchema, data)

        const currentUser = await this.projectMembersRepository.findOne(data.projectId, data.currentUserId)

        if (!currentUser) {
            this.logger.warn('Project member role update failed because current user is not a project member', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                requestedRole: data.role,
                service: 'update-project-member-role',
            })

            throw new NotFoundError('Проект не найден')
        }

        const member = await this.projectMembersRepository.findOne(data.projectId, data.userId)

        if (!member) {
            this.logger.warn('Project member role update failed because target member was not found', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                requestedRole: data.role,
                service: 'update-project-member-role',
            })

            throw new NotFoundError('Участник проекта не найден')
        }

        if (!currentUser.role.canUpdateProjectMemberRole()) {
            this.logger.warn('Project member role update denied', {
                projectId: data.projectId,
                userId: data.userId,
                requestedRole: data.role,
                currentUser: {
                    id: data.currentUserId,
                    role: currentUser.role.getRole(),
                },
                service: 'update-project-member-role',
            })

            throw new ForbiddenError('Не достаточно прав на изменение роли участника проекта')
        }

        if (member.userId === currentUser.userId) {
            this.logger.warn('Project member role self-update denied', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                requestedRole: data.role,
                service: 'update-project-member-role',
            })

            throw new ForbiddenError('Нельзя изменить свою роль в проекте')
        }

        if (member.role.getRole() === data.role) {
            this.logger.warn('Project member role update skipped because role is already assigned', {
                projectId: data.projectId,
                userId: data.userId,
                currentRole: member.role.getRole(),
                requestedRole: data.role,
                currentUserId: data.currentUserId,
                service: 'update-project-member-role',
            })

            throw new BadRequestError('У участника проекта уже назначена эта роль')
        }

        // TODO: Вынести в domain policy

        if (data.role === ProjectMemberRoles.Owner) {
            this.logger.warn('Project owner role assignment denied', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                requestedRole: data.role,
                service: 'update-project-member-role',
            })

            throw new ForbiddenError('Нельзя назначить роль владельца проекта')
        }

        if (member.role.isOwner()) {
            this.logger.warn('Project owner role update denied', {
                projectId: data.projectId,
                userId: data.userId,
                currentUserId: data.currentUserId,
                requestedRole: data.role,
                service: 'update-project-member-role',
            })

            throw new ForbiddenError('Нельзя изменить роль владельца проекта')
        }

        const updatedMemberRole = await this.projectMembersRepository.updateRole(member.id, data.role)

        this.logger.info('Project member role updated', {
            membershipId: updatedMemberRole.id,
            projectId: updatedMemberRole.projectId,
            userId: updatedMemberRole.userId,
            previousRole: member.role.getRole(),
            currentRole: updatedMemberRole.role.getRole(),
            updatedBy: data.currentUserId,
            service: 'update-project-member-role',
        })

        return updatedMemberRole
    }
}
