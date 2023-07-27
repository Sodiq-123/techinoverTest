/*
  Warnings:

  - Made the column `droneId` on table `Medication` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_droneId_fkey";

-- AlterTable
ALTER TABLE "Medication" ALTER COLUMN "droneId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
