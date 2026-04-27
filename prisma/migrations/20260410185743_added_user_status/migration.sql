/*
  Warnings:

  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('Active', 'Archived');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'Active';

-- DropEnum
DROP TYPE "users_status";
