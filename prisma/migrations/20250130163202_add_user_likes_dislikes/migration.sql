-- AlterTable
ALTER TABLE "ChildComment" ADD COLUMN     "userDislikes" INTEGER[],
ADD COLUMN     "userLikes" INTEGER[];

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userDislikes" INTEGER[],
ADD COLUMN     "userLikes" INTEGER[];
