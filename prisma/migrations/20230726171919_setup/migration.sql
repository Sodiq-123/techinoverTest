-- CreateEnum
CREATE TYPE "DroneModel" AS ENUM ('LIGHTWEIGHT', 'MIDDLEWEIGHT', 'CRUISERWEIGHT', 'HEAVYWEIGHT');

-- CreateEnum
CREATE TYPE "DroneState" AS ENUM ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING');

-- CreateTable
CREATE TABLE "Drone" (
    "id" TEXT NOT NULL,
    "serialNo" TEXT NOT NULL,
    "model" "DroneModel" NOT NULL,
    "weightLimit" DECIMAL(10,2) NOT NULL,
    "batteryCapacity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drone_serialNo_key" ON "Drone"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_name_key" ON "Medication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_code_key" ON "Medication"("code");
