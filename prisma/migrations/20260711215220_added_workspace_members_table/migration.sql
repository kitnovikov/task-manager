-- CreateEnum
CREATE TYPE "WorkspaceMemberRole" AS ENUM ('Owner', 'Admin', 'Manager', 'Member', 'Viewer');

-- CreateEnum
CREATE TYPE "WorkspaceMemberStatus" AS ENUM ('Active', 'Invited', 'Removed');

-- CreateTable
CREATE TABLE "workspaces_members" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceMemberRole" NOT NULL,
    "status" "WorkspaceMemberStatus" NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_members_workspace_id_userId_invited_by_id_key" ON "workspaces_members"("workspace_id", "userId", "invited_by_id");
