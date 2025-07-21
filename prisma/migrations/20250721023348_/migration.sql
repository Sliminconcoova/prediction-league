/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Prediction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,fixtureId]` on the table `Prediction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "createdAt",
DROP COLUMN "points";

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_fixtureId_key" ON "Prediction"("userId", "fixtureId");
