import UserRoutes from './user.routes.js';
import AuthRoutes from "./auth.routes.js";
import EmailConfirmationRoutes from "./email-confirmation.routes.js";
import ProjectRoutes from "./project.routes.js";
import ProjectMemberRoutes from "./project-member.routes.js";
import WorkspaceRoutes from "./workspace.routes.js";

export default [
    AuthRoutes,
    UserRoutes,
    EmailConfirmationRoutes,
    WorkspaceRoutes,
    ProjectRoutes,
    ProjectMemberRoutes,
]
