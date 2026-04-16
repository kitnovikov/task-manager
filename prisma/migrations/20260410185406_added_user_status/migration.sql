-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Archived');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'Active';
