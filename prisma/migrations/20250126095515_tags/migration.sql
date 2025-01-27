/*
  Warnings:

  - The `tags` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('BUG', 'FEATURE_REQUEST', 'PERFORMANCE', 'UI', 'SECURITY');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tags",
ADD COLUMN     "tags" "Tag"[];
