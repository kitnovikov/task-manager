import Bottle from "bottlejs";

// Database
import PrismaDatabase from "./database/prisma.database.js";

// SMTP
import SMTPService from "./mail/services/smtp.service.js";

// Repositories
import PrismaTokenRepository from "./auth/repositories/prisma.token.repository.js";
import PrismaUserRepository from "./auth/repositories/prisma.user.repository.js";

// Services
import TokenService from "./auth/services/token.service.js";
import UserService from "./auth/services/user.service.js";
import AuthService from "./auth/services/auth.service.js";

// Controllers
import AuthControllers from "./http/controllers/auth.controllers.js";
import UserControllers from "./http/controllers/user.controllers.js";
import EmailConfirmationService from "./auth/services/email.confirmation.service.js";

const createContainer = (config, logger) => {
    const bottle = new Bottle()

    bottle.factory('logger', () => logger)

    // Database
    bottle.factory('database', () => new PrismaDatabase(config, logger))

    // Repositories
    bottle.factory('tokenRepository', (container) => new PrismaTokenRepository(container.database))
    bottle.factory('userRepository', (container) => new PrismaUserRepository(container.database))

    // Services
    bottle.factory('tokenService', (container) => new TokenService(config, container.tokenRepository, logger))
    bottle.factory('userService', (container) => new UserService(container.userRepository, logger))
    bottle.factory('mailService', (container) => new EmailConfirmationService(config, new SMTPService(config, logger), logger))
    bottle.factory('authService', (container) => new AuthService(container.tokenService, container.userService, container.mailService, logger))

    // Controllers
    bottle.factory('authControllers', (container) => new AuthControllers(container.authService))
    bottle.factory('userControllers', (container) => new UserControllers(container.userService))

    return bottle.container
}

export default createContainer