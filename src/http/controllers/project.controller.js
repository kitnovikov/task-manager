import CreateProjectRequestDto from "../../project/dto/project/create-project.request.dto.js";

export default class ProjectController {
    constructor(projectService) {
        this.projectService = projectService
    }

    async create(req, res) {
        const project = await this.projectService.createProject(new CreateProjectRequestDto({
            ...req.body,
            createdBy: req.user.id,
        }))

        return res.code(201).send(project)
    }

    async getById(req, res) {
        const { projectId } = req.params

        const project = await this.projectService.getProjectById(projectId, req.user.id)

        return res.code(200).send(project)
    }

    async getAll(req, res) {
        const projects = await this.projectService.getAllProjects(req.user.id)

        return res.code(200).send(projects)
    }
}
