import * as express from 'express';
import { RegisterDroneDto, RegisterDroneReq } from '../../dto/drone.dto';
import { validatePayload } from '../../dto/index.dto';
import dronesService from './drones.service';
import {
  LoadDroneWithMedicationDto,
  LoadDroneWithMedicationReq,
} from '../../dto/load-drone.dto';
import { DroneStateDto } from 'src/dto/dronestate.dto';

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
    if (registerDrone.error) {
      return res.status(registerDrone.status).json({
        status: 'error',
        message: registerDrone.error,
      });
    }
    return res.status(201).json({
      status: 'success',
      message: 'Drone registered successfully',
      data: registerDrone,
    });
  },
);

dronesRouter.get(
  '/:droneId',
  async (req: express.Request, res: express.Response) => {
    const droneId = req.params.droneId;
    const drone = await dronesService.getDroneById(droneId);
    if (drone.error || !drone.data) {
      return res.status(drone.status).json({
        status: 'error',
        message: drone.error,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Drone fetched successfully',
      data: drone,
    });
  },
);

dronesRouter.post(
  '/load',
  async (req: LoadDroneWithMedicationReq, res: express.Response) => {
    const loadDroneWithMedicationDto = new LoadDroneWithMedicationDto(req.body);
    const validate = await validatePayload(loadDroneWithMedicationDto);

    if (validate.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
    }

    const loadDroneWithMedication = await dronesService.loadDroneWithMedication(
      loadDroneWithMedicationDto,
    );
    if (loadDroneWithMedication.error) {
      return res.status(loadDroneWithMedication.status).json({
        status: 'error',
        message: loadDroneWithMedication.error,
      });
    }
    return res.status(201).json({
      status: 'success',
      message: 'Drone loaded successfully',
      data: loadDroneWithMedication,
    });
  },
);

dronesRouter.get(
  '/:droneId/loaded-medications',
  async (req: express.Request, res: express.Response) => {
    const droneId = req.params.droneId;
    const loadedDrones = await dronesService.getLoadedDroneMedications(droneId);
    if (loadedDrones.error) {
      return res.status(loadedDrones.status).json({
        status: 'error',
        data: loadedDrones.error,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Loaded drones fetched successfully',
      data: loadedDrones.data,
    });
  },
);

dronesRouter.get(
  '/available',
  async (req: express.Request, res: express.Response) => {
    const availableDrones = await dronesService.availableDronesForLoading();
    if (availableDrones.error) {
      return res.status(availableDrones.status).json({
        status: 'error',
        data: availableDrones.error,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Available drones fetched successfully',
      data: availableDrones,
    });
  },
);

dronesRouter.get(
  '/:droneId/battery-level',
  async (req: express.Request, res: express.Response) => {
    const droneId = req.params.droneId;
    const loadedDrones = await dronesService.droneBatterylevel(droneId);
    if (loadedDrones.error) {
      return res.status(loadedDrones.status).json({
        status: 'error',
        data: loadedDrones.error,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Loaded drones fetched successfully',
      data: loadedDrones,
    });
  },

  dronesRouter.put(
    '/:droneId/updateState',
    async (req: express.Request, res: express.Response) => {
      const droneId = req.params.droneId;
      const updateStateDto = new DroneStateDto(req.body);

      const validate = await validatePayload(updateStateDto);
      if (validate.status === 'error') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid payload',
          data: validate.errors,
        });
      }
      const updateState = await dronesService.setDroneState(
        droneId,
        updateStateDto,
      );
      if (updateState.error) {
        return res.status(updateState.status).json({
          status: 'error',
          data: updateState.error,
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Drones state updated successfully',
        data: updateState.data,
      });
    },
  ),
);

export default (app: express.Router) => {
  app.use('/drones', dronesRouter);
};
