-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_updated_by_fkey";

-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "updated_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
