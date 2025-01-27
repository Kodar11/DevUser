/*
  Warnings:

  - You are about to drop the column `upvote` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "upvote",
ADD COLUMN     "upvoteCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userUpvotes" INTEGER[];
