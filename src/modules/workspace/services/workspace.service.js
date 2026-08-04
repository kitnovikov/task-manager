import BadRequestError from "../../../http/errors/badRequest.error.js";
import WorkspaceSchema from "../validation/workspace.schema.js";
import CreateWorkspaceDto from "../dto/workspace/create-workspace.dto.js";
import AddWorkspaceMemberDto from "../dto/workspace-member/add-workspace-member.dto.js";
import {WorkspaceMemberRolesEnum} from "../entities/workspace-member-roles.enum.js";
import {WorkspaceMemberStatusesEnum} from "../entities/workspace-member-statuses.enum.js";
import {WorkspaceStatusesEnum} from "../entities/workspace-statuses.enum.js";
import WorkspaceAccessGuard from "../../authorization/guards/workspace-access.guard.js";
import PrismaWorkspaceQueryBuilder from "../queries/prisma.workspace-query-builder.js";
import WorkspaceWithMemberRoleReadModel from "../read-model/workspace-with-member-role.read-model.js";

export default class WorkspaceService {
    constructor(prismaDatabase, workspaceRepository, workspaceMembersRepository, logger) {
        this.prismaDatabase = prismaDatabase
        this.workspaceRepository = workspaceRepository
        this.workspaceMembersRepository = workspaceMembersRepository
        this.logger = logger
    }

    async createWorkspace(user, dto) {
        await WorkspaceSchema.validator(WorkspaceSchema.createWorkspaceSchema, dto)

        const slugExist = await this.workspaceRepository.findOne({ slug: dto.slug })

        if (slugExist) {
            throw new BadRequestError('Рабочее пространство с таким ключом уже существует')
        }

        const createdWorkspace = this.prismaDatabase.transaction(async (tx) => {
            const workspace = await this.workspaceRepository.create(
                new CreateWorkspaceDto({
                    name: dto.name,
                    slug: dto.slug,
                    description: dto.description,
                    status: WorkspaceStatusesEnum.Active,
                    ownerId: user.id,
                    updatedBy: user.id,
                }), tx)

            await this.workspaceMembersRepository.create(new AddWorkspaceMemberDto({
                workspaceId: workspace.id,
                userId: user.id,
                role: WorkspaceMemberRolesEnum.Owner,
                status: WorkspaceMemberStatusesEnum.Active,
            }), tx)

            return workspace
        })

        return createdWorkspace
    }

    async getAllWorkspaces(user, pagination) {
        return await this.workspaceMembersRepository.findAll(
            PrismaWorkspaceQueryBuilder.buildVisibleWorkspacesByMemberQuery({
                userId: user.id,
                memberStatus: WorkspaceMemberStatusesEnum.Active,
                visibleArchivedForRoles: [ WorkspaceMemberRolesEnum.Owner ],
                visibleWorkspaceStatuses: [ WorkspaceStatusesEnum.Active ],
                pagination,
            })
        )
    }

    async getWorkspaceById(user, workspaceId) {
        await WorkspaceSchema.validator(WorkspaceSchema.id, workspaceId)

        const [ member, workspace ] = await Promise.all([
            this.workspaceMembersRepository.findOne({ workspaceId: workspaceId, userId: user.id }),
            this.workspaceRepository.findOne({ id: workspaceId })
        ])

        WorkspaceAccessGuard.assertCanGetWorkspace(member, workspace)

        return new WorkspaceWithMemberRoleReadModel(workspace, member)
    }

    async updateWorkspaceById(user, workspaceId, data) {
        await WorkspaceSchema.validator(WorkspaceSchema.updateWorkspaceSchema, { ...data, id: workspaceId })

        const [ member, workspace ] = await Promise.all([
            this.workspaceMembersRepository.findOne({ workspaceId: workspaceId, userId: user.id }),
            this.workspaceRepository.findOne({ id: workspaceId })
        ])

        WorkspaceAccessGuard.assertCanUpdateWorkspace(member, workspace)

        const updatedWorkspace = await this.workspaceRepository.update(
            PrismaWorkspaceQueryBuilder.buildUpdateWorkspaceByIdQuery({
                workspaceId,
                data: {
                    ...data,
                    updatedBy: user.id,
                },
            })
        )

        return new WorkspaceWithMemberRoleReadModel(updatedWorkspace, member)
    }

    async archiveWorkspaceById(user, workspaceId) {
        await WorkspaceSchema.validator(WorkspaceSchema.id, workspaceId)

        const [ member, workspace ] = await Promise.all([
            this.workspaceMembersRepository.findOne({ workspaceId: workspaceId, userId: user.id }),
            this.workspaceRepository.findOne({ id: workspaceId })
        ])

        WorkspaceAccessGuard.assertCanArchiveWorkspace(member, workspace)

        const updatedWorkspace = await this.workspaceRepository.update(
            PrismaWorkspaceQueryBuilder.buildUpdateWorkspaceByIdQuery({
                workspaceId,
                data: {
                    status: WorkspaceStatusesEnum.Archived,
                    archivedAt: new Date(),
                    archivedBy: user.id,
                }
            })
        )

        return new WorkspaceWithMemberRoleReadModel(updatedWorkspace, member)
    }

    async unarchiveWorkspaceById(user, workspaceId) {
        await WorkspaceSchema.validator(WorkspaceSchema.id, workspaceId)

        const [ member, workspace ] = await Promise.all([
            this.workspaceMembersRepository.findOne({ workspaceId: workspaceId, userId: user.id }),
            this.workspaceRepository.findOne({ id: workspaceId })
        ])

        WorkspaceAccessGuard.assertCanUnarchiveWorkspace(member, workspace)

        const updatedWorkspace = await this.workspaceRepository.update(
            PrismaWorkspaceQueryBuilder.buildUpdateWorkspaceByIdQuery({
                workspaceId,
                data: {
                    status: WorkspaceStatusesEnum.Active,
                    archivedAt: null,
                    archivedBy: null,
                }
            })
        )

        return new WorkspaceWithMemberRoleReadModel(updatedWorkspace, member)
    }
}
