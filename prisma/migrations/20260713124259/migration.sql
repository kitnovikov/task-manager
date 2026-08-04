/*
  Warnings:

  - A unique constraint covering the columns `[workspace_id,userId]` on the table `workspaces_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_by` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "workspaces_members_workspace_id_key";

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "archived_at" TIMESTAMP(3),
ADD COLUMN     "archived_by" TEXT,
ADD COLUMN     "updated_by" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_members_workspace_id_userId_key" ON "workspaces_members"("workspace_id", "userId");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_archived_by_fkey" FOREIGN KEY ("archived_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
