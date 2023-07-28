import { DroneState, PrismaClient } from '@prisma/client';
import { RegisterDroneDto } from '../../dto/drone.dto';
import { LoadDroneWithMedicationDto } from '../../dto/load-drone.dto';
import { Helper } from '../../utils/helpers';
import { MedicationService } from '../medications/medications.service';
import { DroneStateDto } from '../../dto/dronestate.dto';

const prisma = new PrismaClient();

export class DronesService {
  medicationService: MedicationService;
  constructor() {
    this.medicationService = new MedicationService();
  }

  public async registerDrone(registerDroneDto: RegisterDroneDto) {
    try {
      const { model, weightLimit, batteryCapacity } = registerDroneDto;
      const serialNo = Helper.generateRandomString(16);
      switch (model) {
        case 'LIGHTWEIGHT':
          if (Number(weightLimit) < 100 || Number(weightLimit) > 200) {
            return {
              status: 400,
              error:
                'Weight limit for LIGHTWEIGHT drone must be between 100 and 200',
            };
          }
          break;
        case 'MIDDLEWEIGHT':
          if (Number(weightLimit) < 200 || Number(weightLimit) > 300) {
            return {
              status: 400,
              error:
                'Weight limit for MIDDLEWEIGHT drone must be between 200 and 300',
            };
          }
          break;
        case 'CRUISERWEIGHT':
          if (Number(weightLimit) < 300 || Number(weightLimit) > 400) {
            return {
              status: 400,
              error:
                'Weight limit for CRUISERWEIGHT drone must be between 300 and 400',
            };
          }
          break;
        case 'HEAVYWEIGHT':
          if (Number(weightLimit) < 400 || Number(weightLimit) > 500) {
            return {
              status: 400,
              error:
                'Weight limit for HEAVYWEIGHT drone must be between 400 and 500',
            };
          }
          break;
        default:
          return {
            status: 400,
            error: 'Invalid drone model',
          };
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

      return {
        data: drone,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async getDroneById(id: string) {
    try {
      const drone = await prisma.drone.findUnique({
        where: {
          id,
        },
        include: {
          medications: true,
        },
      });
      return {
        data: drone,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async loadDroneWithMedication(
    loadDroneWithMedicationDto: LoadDroneWithMedicationDto,
  ) {
    try {
      const drone = await this.getDroneById(loadDroneWithMedicationDto.droneId);
      if (drone.error || !drone.data) {
        return {
          status: 404,
          error: 'Drone not found',
        };
      }

      if (drone.data.state === 'LOADED') {
        return {
          status: 400,
          error: 'Drone is already loaded',
        };
      }

      if (drone.data.remainingBattery < 25) {
        return {
          status: 400,
          error: 'Drone has reached its maximum capacity',
        };
      }

      if (
        Number(drone.data.remainingWeight) < loadDroneWithMedicationDto.weight
      ) {
        return {
          status: 400,
          error: 'Drone has reached its maximum capacity',
        };
      }

      const medication = await this.medicationService.createMedication(
        loadDroneWithMedicationDto,
      );

      if (medication.error) {
        return {
          status: 400,
          error: medication.error,
        };
      }

      const state: DroneState =
        Number(drone.data.remainingBattery) - 25 < 25 ||
        Number(drone.data.remainingWeight) - Number(medication.data.weight) ===
          0
          ? 'LOADED'
          : 'LOADING';

      const updatedDrone = await prisma.drone.update({
        where: {
          id: drone.data.id,
        },
        data: {
          remainingWeight:
            Number(drone.data.remainingWeight) - Number(medication.data.weight),
          remainingBattery: Number(drone.data.remainingBattery) - 25,
          state,
        },
        include: {
          medications: true,
        },
      });

      return {
        data: updatedDrone,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async getLoadedDroneMedications(droneId: string) {
    try {
      const drone = await this.getDroneById(droneId);
      if (drone.error || !drone.data) {
        return {
          status: 404,
          error: 'Drone not found',
        };
      }

      if (drone.data.state !== 'LOADED') {
        return {
          status: 400,
          error: 'Drone is not loaded',
        };
      }

      const medications = await prisma.medication.findMany({
        where: {
          droneId,
        },
      });

      return {
        data: medications,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async availableDronesForLoading() {
    try {
      const drones = await prisma.drone.findMany({
        where: {
          state: {
            in: ['LOADING', 'IDLE'],
          },
        },
      });

      return {
        data: drones,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async droneBatterylevel(droneId: string) {
    try {
      const drone = await this.getDroneById(droneId);
      if (drone.error || !drone.data) {
        return {
          status: 404,
          error: 'Drone not found',
        };
      }

      return {
        data: drone.data.remainingBattery,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }

  public async setDroneState(droneId: string, droneStateDto: DroneStateDto) {
    try {
      const drone = await this.getDroneById(droneId);
      if (drone.error || !drone.data) {
        return {
          status: 404,
          error: 'Drone not found',
        };
      }

      const updatedDrone = await prisma.drone.update({
        where: {
          id: drone.data.id,
        },
        data: {
          state: droneStateDto.state,
        },
      });

      return {
        data: updatedDrone,
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  }
}

const dronesService = new DronesService();
export default dronesService;
