/*
  Warnings:

  - You are about to drop the column `courseSeries` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `course` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "courseSeries",
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
