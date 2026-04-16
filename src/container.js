import Bottle from "bottlejs";

// Database
import PrismaAdapter from "./database/prisma.client.js";

// Repositories
import TokenRepository from "./repositories/token.repository.js";
import UserRepository from "./repositories/user.repository.js";
import ProjectRepository from "./repositories/project.repository.js";

// Services
import TokenService from "./services/token.service.js";
import UserService from "./services/user.service.js";
import AuthService from "./services/auth.service.js";
import ProjectService from "./services/project.service.js";
import StatusRepository from "./repositories/status.repository.js";

// Controllers
import AuthControllers from "./controllers/auth.controllers.js";
import UserControllers from "./controllers/user.controllers.js";
import ProjectControllers from "./controllers/project.controllers.js";
import StatusService from "./services/status.service.js";
import AuthRepository from "./repositories/auth.repository.js";
import ParticipantService from "./services/participant.service.js";
import ParticipantRepository from "./repositories/participant.repository.js";

const createContainer = (config, logger) => {
    const bottle = new Bottle()

    bottle.factory('logger', () => logger)

    // Database
    bottle.factory('database', () => new PrismaAdapter(config, logger.setModule('pg-adapter-prisma')))

    // Repositories
    bottle.factory('tokenRepository', (container) => new TokenRepository(container.database))
    bottle.factory('userRepository', (container) => new UserRepository(container.database))
    bottle.factory('authRepository', (container) => new AuthRepository(container.database))
    bottle.factory('projectRepository', (container) => new ProjectRepository(container.database))
    bottle.factory('participantRepository', (container) => new ParticipantRepository(container.database))
    bottle.factory('statusRepository', (container) => new StatusRepository(container.database))

    // Services
    bottle.factory('tokenService', (container) => new TokenService(config, container.tokenRepository, logger.setModule('token-service')))
    bottle.factory('userService', (container) => new UserService(container.userRepository, logger.setModule('user-service')))
    bottle.factory('authService', (container) => new AuthService(container.tokenService, container.userService, container.authRepository, logger.setModule('auth-service')))
    bottle.factory('participantService', (container) => new ParticipantService(container.participantRepository, logger.setModule('user-service')))
    bottle.factory('projectService', (container) => new ProjectService(container.projectRepository, container.participantService, logger.setModule('project-service')))
    bottle.factory('statusService', (container) => new StatusService(container.statusRepository, logger.setModule('status-service')))

    // Controllers
    bottle.factory('authControllers', (container) => new AuthControllers(container.authService))
    bottle.factory('userControllers', (container) => new UserControllers(container.userService))
    bottle.factory('projectControllers', (container) => new ProjectControllers(container.projectService, container.statusService))

    return bottle.container
}

export default createContainer