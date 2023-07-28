import { DroneState, PrismaClient } from '@prisma/client';
import { RegisterDroneDto } from '../../dto/drone.dto';
import { LoadDroneWithMedicationDto } from '../../dto/load-drone.dto';
import { CustomHttpException } from '../../exceptions/http-exception.filter';
import { Helper } from '../../utils/helpers';
import { MedicationService } from '../medications/medications.service';

const prisma = new PrismaClient();

export class DronesService {
  medicationService: MedicationService;
  constructor() {
    this.medicationService = new MedicationService();
  }

  public async registerDrone(registerDroneDto: RegisterDroneDto) {
    const { model, weightLimit, batteryCapacity } = registerDroneDto;
    const serialNo = Helper.generateRandomString(16);
    switch (model) {
      case 'LIGHTWEIGHT':
        if (Number(weightLimit) < 100 || Number(weightLimit) > 200) {
          throw new CustomHttpException(
            400,
            'Weight limit for LIGHTWEIGHT drone must be between 100 and 200',
          );
        }
        break;
      case 'MIDDLEWEIGHT':
        if (Number(weightLimit) < 200 || Number(weightLimit) > 300) {
          throw new CustomHttpException(
            400,
            'Weight limit for MIDDLEWEIGHT drone must be between 200 and 300',
          );
        }
        break;
      case 'CRUISERWEIGHT':
        if (Number(weightLimit) < 300 || Number(weightLimit) > 400) {
          throw new CustomHttpException(
            400,
            'Weight limit for CRUISERWEIGHT drone must be between 300 and 400',
          );
        }
        break;
      case 'HEAVYWEIGHT':
        if (Number(weightLimit) < 400 || Number(weightLimit) > 500) {
          throw new CustomHttpException(
            400,
            'Weight limit for HEAVYWEIGHT drone must be between 400 and 500',
          );
        }
        break;
      default:
        throw new CustomHttpException(400, 'Invalid drone model');
    }

    const drone = await prisma.drone.create({
      data: {
        serialNo,
        model,
        weightLimit,
        remainingWeight: weightLimit,
        batteryCapacity,
        remainingBattery: batteryCapacity,
      },
    });

    return drone;
  }

  public async getDroneById(id: string) {
    const drone = await prisma.drone.findUnique({
      where: {
        id,
      },
    });

    if (!drone) {
      throw new CustomHttpException(404, 'Drone not found');
    }

    return drone;
  }

  public async loadDroneWithMedication(
    loadDroneWithMedicationDto: LoadDroneWithMedicationDto,
  ) {
    const drone = await this.getDroneById(loadDroneWithMedicationDto.droneId);
    if (!drone) {
      throw new CustomHttpException(404, 'Drone not found');
    }

    if (drone.state === 'LOADED') {
      throw new CustomHttpException(
        400,
        'Drone has reached its maximum capacity',
      );
    }

    if (drone.remainingBattery < 25) {
      throw new CustomHttpException(
        400,
        'Drone battery level is below 25%, so cannot load',
      );
    }

    if (Number(drone.remainingWeight) < loadDroneWithMedicationDto.weight) {
      throw new CustomHttpException(
        400,
        'Drone weight limit is not enough to load this medication',
      );
    }

    const medication = await this.medicationService.createMedication(
      loadDroneWithMedicationDto,
    );

    const state: DroneState =
      Number(drone.remainingBattery) - 25 < 25 ? 'LOADED' : 'LOADING';

    await prisma.drone.update({
      where: {
        id: drone.id,
      },
      data: {
        remainingWeight:
          Number(drone.remainingWeight) - Number(medication.weight),
        remainingBattery: Number(drone.remainingBattery) - 25,
        state,
      },
    });
  }

  public async getLoadedDroneMedications(droneId: string) {
    const drone = await this.getDroneById(droneId);
    if (!drone) {
      throw new CustomHttpException(404, 'Drone not found');
    }

    if (drone.state !== 'LOADED') {
      throw new CustomHttpException(400, 'Drone is not loaded');
    }

    const medications = await prisma.medication.findMany({
      where: {
        droneId,
      },
    });

    return medications;
  }

  public async availableDronesForLoading() {
    const drones = await prisma.drone.findMany({
      where: {
        state: 'LOADING' || 'IDLE',
      },
    });

    return drones;
  }

  public async droneBatterylevel(droneId: string) {
    const drone = await this.getDroneById(droneId);
    if (!drone) {
      throw new CustomHttpException(404, 'Drone not found');
    }

    return drone.remainingBattery;
  }
}

const dronesService = new DronesService();
export default dronesService;
