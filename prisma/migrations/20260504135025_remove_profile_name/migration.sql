/*
  Warnings:

  - You are about to drop the column `profileName` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `department` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `level` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profileName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "otherName" TEXT,
ALTER COLUMN "department" SET NOT NULL,
ALTER COLUMN "level" SET NOT NULL;
