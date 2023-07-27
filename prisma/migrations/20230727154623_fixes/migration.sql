/*
  Warnings:

  - Added the required column `remainingBatteryCapacity` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingWeightLimit` to the `Drone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drone" ADD COLUMN     "remainingBatteryCapacity" INTEGER NOT NULL,
ADD COLUMN     "remainingWeightLimit" DECIMAL(10,2) NOT NULL;
