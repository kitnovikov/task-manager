import ProjectSchema from "../validation/project.schema.js";
import NotFoundError from "../../http/errors/notFound.error.js";
import {ProjectMemberRoles} from "../entities/project-member-roles.js";
import AddProjectMemberDto from "../dto/project-member/add-project-member.dto.js";

export default class ProjectService {
    constructor(projectRepository, projectMembersRepository, logger) {
        this.projectRepository = projectRepository
        this.projectMembersRepository = projectMembersRepository
        this.logger = logger
    }

    async createProject(data) {
        this.logger.debug('Project creation started', {
            currentUserId: data.createdBy,
            service: 'create-project',
        })

        await ProjectSchema.validator(ProjectSchema.createProjectSchema, data)

        const newProject = await this.projectRepository.save(data)

        this.logger.info('Project created', {
            projectId: newProject.id,
            createdBy: newProject.createdBy,
            service: 'create-project'
        })

        const membership = await this.projectMembersRepository.create(new AddProjectMemberDto({
            projectId: newProject.id,
            userId: newProject.createdBy,
            createdBy: newProject.createdBy,
            role: ProjectMemberRoles.Owner,
        }))

        this.logger.info('User added to project', {
            membershipId: membership.id,
            projectId: membership.projectId,
            userId: membership.userId,
            role: membership.role.getRole(),
            service: 'create-project'
        })

        return newProject
    }

    async getProjectById(projectId, userId) {
        await ProjectSchema.validator(ProjectSchema.id, projectId)

        const project = await this.projectRepository.findByIdForMember(projectId, userId)

        if (!project) {
            this.logger.warn('Project not found or access denied', {
                projectId,
                userId,
                service: 'get-project-by-id',
            })
            throw new NotFoundError('Проект не найден')
        }

        this.logger.info('Project found', {
            projectId: project.id,
            userId,
            service: 'get-project-by-id',
        })

        return project
    }

    async getAllProjects(userId) {
        const projects = await this.projectRepository.findAllByIdForMember(userId)

        if (projects.length === 0) {
            this.logger.warn('Projects not found', {
                userId,
                service: 'get-all-projects',
            })
            throw new NotFoundError('Проекты не найдены')
        }

        this.logger.info('Projects found', {
            projectsCount: projects.length,
            userId,
            service: 'get-all-projects',
        })

        return projects
    }
}
