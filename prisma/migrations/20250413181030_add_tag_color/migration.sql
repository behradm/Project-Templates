/*
  Warnings:

  - Added the required column `updatedAt` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "color" INTEGER DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
