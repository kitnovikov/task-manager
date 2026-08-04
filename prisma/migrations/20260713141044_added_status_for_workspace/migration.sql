-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('Active', 'Archived');

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "status" "WorkspaceStatus" NOT NULL DEFAULT 'Active';
