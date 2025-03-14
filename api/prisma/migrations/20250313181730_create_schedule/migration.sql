/*
  Warnings:

  - You are about to drop the column `endDate` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `borrowerName` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "endDate",
ADD COLUMN     "borrowerName" TEXT NOT NULL,
ADD COLUMN     "dayOfWeek" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT;
