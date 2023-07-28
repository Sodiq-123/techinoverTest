import { DroneModel, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import logger from '../src/utils/logger';

export default class Seeder {
  private dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this.dbClient = dbClient;
  }

  generateMedicationData() {
    return {
      name: faker.string.alphanumeric({ length: 10 }),
      weight: faker.number.float({ min: 50, max: 100 }),
      code: faker.string.alpha({ casing: 'upper', length: 8 }),
      image: faker.image.url(),
    };
  }

  generateMedicationsData(droneId: string, length: number) {
    return Array.from({ length }, () => ({
      droneId,
      ...this.generateMedicationData(),
    }));
  }

  // generate random model
  generateRandomModel = () => {
    const models: DroneModel[] = [
      'LIGHTWEIGHT',
      'MIDDLEWEIGHT',
      'CRUISERWEIGHT',
      'HEAVYWEIGHT',
    ];
    return models[Math.floor(Math.random() * models.length)];
  };

  generateDroneData() {
    const model = this.generateRandomModel();
    const weightLimit =
      model === 'LIGHTWEIGHT'
        ? faker.number.float({ min: 100, max: 200 })
        : model === 'MIDDLEWEIGHT'
        ? faker.number.float({ min: 200, max: 300 })
        : model === 'CRUISERWEIGHT'
        ? faker.number.float({ min: 300, max: 400 })
        : faker.number.float({ min: 400, max: 500 });
    const batteryCapacity = 100;
    return {
      serialNo: faker.string.alphanumeric(16),
      model,
      weightLimit,
      remainingWeight: weightLimit,
      batteryCapacity,
      remainingBattery: batteryCapacity,
    };
  }

  public async seedOne() {
    const drone = await this.dbClient.drone.create({
      data: this.generateDroneData(),
    });

    await this.dbClient.medication.createMany({
      data: this.generateMedicationsData(drone.id, 3),
    });

    const medications = await this.dbClient.medication.findMany({
      where: {
        droneId: drone.id,
      },
    });

    // load drone with medications
    await this.dbClient.drone.update({
      where: {
        id: drone.id,
      },
      data: {
        remainingWeight:
          Number(drone.weightLimit) -
          medications.reduce((acc, curr) => acc + Number(curr.weight), 0),
        remainingBattery: Number(drone.batteryCapacity) - 75,
        state: 'LOADED',
        medications: {
          connect: medications.map((medication) => ({ id: medication.id })),
        },
      },
    });
  }

  public async seed(number = 5) {
    logger.info('Seeding started', 'Seeder', 'seed.log');
    let errorCount = 0;
    for (let i = 0; i < number; i++) {
      try {
        await this.seedOne();
        logger.info(`Seeding ${i + 1} completed`, 'Seeder', 'seed.log');
      } catch (error) {
        logger.error(error, 'Seeder');
        errorCount++;
      }
    }
    logger.info(
      `Seeding completed with ${errorCount} errors`,
      'Seeder',
      'seed.log',
    );
  }
}
