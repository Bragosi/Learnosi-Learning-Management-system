/*
  Warnings:

  - Added the required column `profileName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "profileName" TEXT NOT NULL;
