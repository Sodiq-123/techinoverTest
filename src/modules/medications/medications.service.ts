import { PrismaClient } from '@prisma/client';
import { CreateMedicationDto } from '../../dto/medication.dto';
import { Helper } from '../../utils/helpers';

const prisma = new PrismaClient();

export class MedicationService {
  public async createMedication(createMedicationDto: CreateMedicationDto) {
    try {
      const { name, weight, image, droneId } = createMedicationDto;
      const code = Helper.generateRandomCode(8);
      const medication = await prisma.medication.create({
        data: {
          droneId,
          name,
          weight,
          code,
          image,
        },
      });

      return {
        data: medication,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async getMedicationByName(name: string) {
    try {
      const medication = await prisma.medication.findUnique({
        where: {
          name,
        },
      });

      if (!medication) {
        return {
          status: 404,
          error: 'Medication not found',
        };
      }

      return {
        data: medication,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }
}

const medicationService = new MedicationService();
export default medicationService;
