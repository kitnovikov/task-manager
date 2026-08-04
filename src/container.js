import Bottle from "bottlejs";

// Database
import PrismaDatabase from "./database/prisma.database.js";

// SMTP
import SMTPService from "./modules/mail/services/smtp.service.js";

// Repositories
import PrismaTokenRepository from "./modules/auth/repositories/prisma.token.repository.js";
import PrismaUserRepository from "./modules/auth/repositories/prisma.user.repository.js";
import PrismaProjectRepository from "./project/repositories/prisma.project.repository.js";
import PrismaProjectMembersRepository from "./project/repositories/prisma.project-members.repository.js";
import WorkspaceRepository from "./modules/workspace/repositories/workspace.repository.js";

// Services
import TokenService from "./modules/auth/services/token.service.js";
import UserService from "./modules/auth/services/user.service.js";
import AuthService from "./modules/auth/services/auth.service.js";
import EmailConfirmationService from "./modules/auth/services/email.confirmation.service.js";
import ProjectService from "./project/services/project.service.js";
import ProjectMembersService from "./project/services/project-members.service.js";
import WorkspaceService from "./modules/workspace/services/workspace.service.js";

// Controllers
import AuthControllers from "./http/controllers/auth.controllers.js";
import UserControllers from "./http/controllers/user.controllers.js";
import EmailConfirmationController from "./http/controllers/email-confirmation.controller.js";
import ProjectController from "./http/controllers/project.controller.js";
import ProjectMemberController from "./http/controllers/project-member.controller.js";
import WorkspaceController from "./modules/workspace/controllers/workspace.controller.js";
import WorkspaceMemberRepository from "./modules/workspace/repositories/workspace-member.repository.js";

const createContainer = (config, logger) => {
    const bottle = new Bottle()

    bottle.factory('logger', () => logger)

    // Database
    bottle.factory('database', () => new PrismaDatabase(config, logger))

    // Repositories
    bottle.factory('tokenRepository', (container) => new PrismaTokenRepository(container.database))
    bottle.factory('userRepository', (container) => new PrismaUserRepository(container.database))
    bottle.factory('projectRepository', (container) => new PrismaProjectRepository(container.database))
    bottle.factory('projectMembersRepository', (container) => new PrismaProjectMembersRepository(container.database))
    bottle.factory('workspaceRepository', (container) => new WorkspaceRepository(container.database))
    bottle.factory('workspaceMemberRepository', (container) => new WorkspaceMemberRepository(container.database))


    // Services
    bottle.factory('tokenService', (container) => new TokenService(config, container.tokenRepository, logger))
    bottle.factory('userService', (container) => new UserService(container.userRepository, logger))
    bottle.factory('emailConfirmationService', (container) => new EmailConfirmationService(config, new SMTPService(config, logger), container.userService, logger))
    bottle.factory('authService', (container) => new AuthService(container.tokenService, container.userService, container.emailConfirmationService, logger))
    bottle.factory('projectMembersService', (container) => new ProjectMembersService(container.projectMembersRepository, container.projectRepository, container.userRepository, logger))
    bottle.factory('projectService', (container) => new ProjectService(container.projectRepository, container.projectMembersRepository, logger))
    bottle.factory('workspaceService', (container) => new WorkspaceService(container.database, container.workspaceRepository, container.workspaceMemberRepository, logger))

    // Controllers
    bottle.factory('authControllers', (container) => new AuthControllers(container.authService, container.emailConfirmationService))
    bottle.factory('userControllers', (container) => new UserControllers(container.userService))
    bottle.factory('emailConfirmationControllers', (container) => new EmailConfirmationController(container.emailConfirmationService))
    bottle.factory('projectController', (container) => new ProjectController(container.projectService))
    bottle.factory('projectMemberController', (container) => new ProjectMemberController(container.projectMembersService))
    bottle.factory('workspaceController', (container) => new WorkspaceController(container.workspaceService))

    return bottle.container
}

export default createContainer
