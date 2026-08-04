/*
  Warnings:

  - You are about to drop the column `createdBy` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_statuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('Owner', 'Admin', 'Member');

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "createdBy",
ADD COLUMN     "created_by" TEXT NOT NULL;

-- DropTable
DROP TABLE "participants";

-- DropTable
DROP TABLE "task_statuses";

-- DropTable
DROP TABLE "tasks";

-- CreateTable
CREATE TABLE "project_members" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'Member',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_user_id_key" ON "project_members"("project_id", "user_id");
