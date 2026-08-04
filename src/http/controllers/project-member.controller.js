import AddProjectMemberRequestDto from "../../project/dto/project-member/add-project-member.request.dto.js"
import ProjectMemberResponseDto from "../../project/dto/project-member/project-member.response.dto.js";
import GetProjectMembersRequestDto from "../../project/dto/project-member/get-project-members.request.dto.js";
import GetProjectMembersResponseDto from "../../project/dto/project-member/get-project-members.response.dto.js";
import RemoveProjectMemberRequestDto from "../../project/dto/project-member/remove-project-member.request.dto.js";
import UpdateMemberRoleRequestDto from "../../project/dto/project-member/update-member-role.request.dto.js";
import UpdateMemberRoleResponseDto from "../../project/dto/project-member/update-member-role.response.dto.js";

export default class ProjectMemberController {
    constructor(projectMembersService) {
        this.projectMembersService = projectMembersService
    }

    async addMember(req, res) {
        const member = await this.projectMembersService.addMember(
            new AddProjectMemberRequestDto({
                projectId: req.params.projectId,
                userId: req.body.userId,
                currentUserId: req.user.id
            })
        )

        return res.code(201).send(new ProjectMemberResponseDto(member))
    }

    async getMembers(req, res) {
        const members = await this.projectMembersService.getMembers(
            new GetProjectMembersRequestDto({
                projectId: req.params.projectId,
                currentUserId: req.user.id
            })
        )

        return res.code(200).send(new GetProjectMembersResponseDto(members))
    }

    async removeMember(req, res) {
        await this.projectMembersService.removeMember(
            new RemoveProjectMemberRequestDto({
                projectId: req.params.projectId,
                userId: req.params.userId,
                currentUserId: req.user.id,
            })
        )

        // TODO: Уточнить, как лучше: передавать currentUserId или createdBy? Думаю, что в этом месте лучше currentUserId, а когда делаю запись в бд, то добавить dto, который возвращает параметр createdBy

        return res.code(204).send()
    }

    async updateMemberRole(req, res) {
        const member = await this.projectMembersService.updateMemberRole(
            new UpdateMemberRoleRequestDto({
                projectId: req.params.projectId,
                userId: req.params.userId,
                currentUserId: req.user.id,
                role: req.body.role,
            })
        )

        return res.code(200).send(new UpdateMemberRoleResponseDto(member))
    }
}
