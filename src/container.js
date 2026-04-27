import Bottle from "bottlejs";

// Database
import PrismaAdapter from "./database/prisma.client.js";

// Repositories
import TokenRepository from "./repositories/token.repository.js";
import UserRepository from "./repositories/user.repository.js";

// Services
import TokenService from "./services/token.service.js";
import UserService from "./services/user.service.js";
import AuthService from "./services/auth.service.js";

// Controllers
import AuthControllers from "./http/controllers/auth.controllers.js";
import UserControllers from "./http/controllers/user.controllers.js";

const createContainer = (config, logger) => {
    const bottle = new Bottle()

    bottle.factory('logger', () => logger)

    // Database
    bottle.factory('database', () => new PrismaAdapter(config, logger.setModule('pg-adapter-prisma')))

    // Repositories
    bottle.factory('tokenRepository', (container) => new TokenRepository(container.database))
    bottle.factory('userRepository', (container) => new UserRepository(container.database))

    // Services
    bottle.factory('tokenService', (container) => new TokenService(config, container.tokenRepository, logger.setModule('token-service')))
    bottle.factory('userService', (container) => new UserService(container.userRepository, logger.setModule('user-service')))
    bottle.factory('authService', (container) => new AuthService(container.tokenService, container.userService, logger.setModule('auth-service')))

    // Controllers
    bottle.factory('authControllers', (container) => new AuthControllers(container.authService))
    bottle.factory('userControllers', (container) => new UserControllers(container.userService))

    return bottle.container
}

export default createContainer