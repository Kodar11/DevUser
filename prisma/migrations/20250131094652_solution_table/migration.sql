-- CreateEnum
CREATE TYPE "SolutionSourceType" AS ENUM ('WEB_SCRAPED', 'USER_SUBMITTED', 'LLM_GENERATED');

-- CreateTable
CREATE TABLE "Solution" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "sourceType" "SolutionSourceType" NOT NULL,
    "solutionText" TEXT NOT NULL,
    "solutionLink" TEXT,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedById" INTEGER,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solution_postId_solutionLink_key" ON "Solution"("postId", "solutionLink");

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
