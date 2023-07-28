// Import required libraries
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export async function checkBatteryLevels() {
  try {
    // Get all drones from the database
    const drones = await prisma.drone.findMany();

    // Log battery levels for each drone
    drones.forEach((drone) => {
      logger.info(`Drone serial No: ${drone.serialNo}`, '', 'batteryLevel');
      logger.info(
        `Battery Level: ${drone.remainingBattery}%`,
        '',
        'batteryLevel',
      );
      logger.info(
        '-------------------------',
        '-------------------------',
        'batteryLevel',
      );
    });
  } catch (error) {
    console.error('Error occurred while checking battery levels:', error);
  } finally {
    await prisma.$disconnect();
  }
}
