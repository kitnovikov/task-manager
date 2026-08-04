/*
  Warnings:

  - You are about to drop the `project_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workspace_id]` on the table `workspaces_members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_created_by_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_created_by_fkey";

-- DropIndex
DROP INDEX "workspaces_members_workspace_id_userId_invited_id_key";

-- DropTable
DROP TABLE "project_members";

-- DropTable
DROP TABLE "projects";

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_members_workspace_id_key" ON "workspaces_members"("workspace_id");

-- AddForeignKey
ALTER TABLE "workspaces_members" ADD CONSTRAINT "workspaces_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces_members" ADD CONSTRAINT "workspaces_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
