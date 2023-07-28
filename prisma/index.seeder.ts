import { PrismaClient } from '@prisma/client';
import Seeder from './seed';
import logger from '../src/utils/logger';

(async () => {
  logger.info('Seeding database...', 'Seeder', 'seed');
  const prisma = new PrismaClient();
  const seeder = new Seeder(prisma);
  await seeder.seed(5);

  await prisma.$disconnect();
  logger.info('Successfully disconnected from database', 'Seeder', 'seed');
})();
