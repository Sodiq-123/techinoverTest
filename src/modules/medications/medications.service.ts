import { PrismaClient } from '@prisma/client';
import { CreateMedicationDto } from '../../dto/medication.dto';
import { CustomHttpException } from '../../exceptions/http-exception.filter';
import { Helper } from '../../utils/helpers';

const prisma = new PrismaClient();

export class MedicationService {
  public async createMedication(createMedicationDto: CreateMedicationDto) {
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

    return medication;
  }

  public async getMedicationByName(name: string) {
    const medication = await prisma.medication.findUnique({
      where: {
        name,
      },
    });

    if (!medication) {
      throw new CustomHttpException(404, 'Medication not found');
    }

    return medication;
  }
}

const medicationService = new MedicationService();
export default medicationService;
