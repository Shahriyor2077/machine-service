/*
  Warnings:

  - You are about to drop the column `regional` on the `district` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `district` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "district" DROP COLUMN "regional",
ADD COLUMN     "regionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL;
