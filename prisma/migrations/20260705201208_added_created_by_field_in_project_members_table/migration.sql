/*
  Warnings:

  - Added the required column `created_by` to the `project_members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "created_by" TEXT NOT NULL;
