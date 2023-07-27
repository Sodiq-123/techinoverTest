/*
  Warnings:

  - You are about to drop the column `remainingBatteryCapacity` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `remainingWeightLimit` on the `Drone` table. All the data in the column will be lost.
  - Added the required column `remainingBattery` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingWeight` to the `Drone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drone" DROP COLUMN "remainingBatteryCapacity",
DROP COLUMN "remainingWeightLimit",
ADD COLUMN     "remainingBattery" INTEGER NOT NULL,
ADD COLUMN     "remainingWeight" DECIMAL(10,2) NOT NULL;
