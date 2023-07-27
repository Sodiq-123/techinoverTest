import * as express from 'express';
import { RegisterDroneDto, RegisterDroneReq } from '../../dto/drone.dto';
import { validatePayload } from '../../dto/index.dto';
import dronesService from './drones.service';
import {
  LoadDroneWithMedicationDto,
  LoadDroneWithMedicationReq,
} from '../../dto/load-drone.dto';

const dronesRouter = express.Router();

dronesRouter.post(
  '/register',
  async (req: RegisterDroneReq, res: express.Response) => {
    const registerDroneDto = new RegisterDroneDto(req.body);
    const validate = await validatePayload(registerDroneDto);
    if (validate.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
    }

    const registerDrone = await dronesService.registerDrone(registerDroneDto);
    return res.status(201).json({
      status: 'success',
      message: 'Drone registered successfully',
      data: registerDrone,
    });
  },
);

dronesRouter.post(
  '/load',
  async (req: LoadDroneWithMedicationReq, res: express.Response) => {
    const loadDroneWithMedicationDto = new LoadDroneWithMedicationDto(req.body);
    const validate = await validatePayload(loadDroneWithMedicationDto);

    if (validate.errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
    }

    const loadDroneWithMedication = await dronesService.loadDroneWithMedication(
      loadDroneWithMedicationDto,
    );

    return res.status(201).json({
      status: 'success',
      message: 'Drone loaded successfully',
      data: loadDroneWithMedication,
    });
  },
);

dronesRouter.get(
  ':droneId/loaded-medications',
  async (req: express.Request, res: express.Response) => {
    const droneId = req.params.droneId;
    const loadedDrones = await dronesService.getLoadedDroneMedications(droneId);
    return res.status(200).json({
      status: 'success',
      message: 'Loaded drones fetched successfully',
      data: loadedDrones,
    });
  },
);

dronesRouter.get(
  'available-drones',
  async (req: express.Request, res: express.Response) => {
    const availableDrones = await dronesService.availableDronesForLoading();
    return res.status(200).json({
      status: 'success',
      message: 'Available drones fetched successfully',
      data: availableDrones,
    });
  },
);

dronesRouter.get(
  ':droneId/battery-level',
  async (req: express.Request, res: express.Response) => {
    const droneId = req.params.droneId;
    const loadedDrones = await dronesService.droneBatterylevel(droneId);
    return res.status(200).json({
      status: 'success',
      message: 'Loaded drones fetched successfully',
      data: loadedDrones,
    });
  },
);

export default (app: express.Router) => {
  app.use('/drones', dronesRouter);
};
