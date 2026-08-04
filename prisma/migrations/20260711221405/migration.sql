/*
  Warnings:

  - You are about to drop the column `invited_by_id` on the `workspaces_members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspace_id,userId,invited_id]` on the table `workspaces_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invited_id` to the `workspaces_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "workspaces_members_workspace_id_userId_invited_by_id_key";

-- AlterTable
ALTER TABLE "workspaces_members" DROP COLUMN "invited_by_id",
ADD COLUMN     "invited_id" TEXT NOT NULL,
ADD CONSTRAINT "workspaces_members_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_members_workspace_id_userId_invited_id_key" ON "workspaces_members"("workspace_id", "userId", "invited_id");
