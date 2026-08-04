import CreateWorkspaceRequestDto from "../dto/workspace/create-workspace.request.dto.js";
import WorkspaceResponseDto from "../dto/workspace/workspace.response.dto.js";
import UpdateWorkspaceRequestDto from "../dto/workspace/update-workspace.request.dto.js";
import ListQueryDto from "../../../http/dto/list.query.dto.js";

export default class WorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService
    }

    async createWorkspace(req, res) {
        const workspace = await this.workspaceService.createWorkspace(
            req.user,
            new CreateWorkspaceRequestDto(req.body)
        )

        return res.code(201).send(new WorkspaceResponseDto(workspace))
    }

    async getAllWorkspaces(req, res) {
        const pagination = new ListQueryDto(req.query)
        const workspaces = await this.workspaceService.getAllWorkspaces(req.user, pagination)

        return res.code(200).send({
            data: workspaces,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
            }
        })
    }

    async getWorkspaceById(req, res) {
        const workspace = await this.workspaceService.getWorkspaceById(req.user, req.params.workspaceId)

        return res.code(200).send({ data: workspace })
    }

    async updateWorkspaceById(req, res) {
        const workspace = await this.workspaceService.updateWorkspaceById(req.user, req.params.workspaceId, new UpdateWorkspaceRequestDto(req.body))

        return res.code(200).send({ data: workspace })
    }

    async archiveWorkspaceById(req, res) {
        await this.workspaceService.archiveWorkspaceById(req.user, req.params.workspaceId)

        return res.code(200).send({ result: 'success' })
    }

    async unarchiveWorkspaceById(req, res) {
        await this.workspaceService.unarchiveWorkspaceById(req.user, req.params.workspaceId)

        return res.code(200).send({ result: 'success' })
    }
}
