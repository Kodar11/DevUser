/*
  Warnings:

  - Added the required column `title` to the `RequirementForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequirementForm" ADD COLUMN     "title" TEXT NOT NULL;
