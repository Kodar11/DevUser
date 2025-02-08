/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Response` table. All the data in the column will be lost.
  - Added the required column `formId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_userId_fkey";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "createdAt",
ADD COLUMN     "formId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "RequirementForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
