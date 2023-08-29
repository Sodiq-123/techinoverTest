import * as express from 'express';
import { RegisterDroneDto, RegisterDroneReq } from '../../dto/drone.dto';
import { validatePayload } from '../../dto/index.dto';
import dronesService from './drones.service';
import {
  LoadDroneWithMedicationDto,
  LoadDroneWithMedicationReq,
} from '../../dto/load-drone.dto';
import { DroneStateDto } from '../../dto/dronestate.dto';
import logger from '../../utils/logger';

const dronesRouter = express.Router();

dronesRouter.post(
  '/register',
  async (req: RegisterDroneReq, res: express.Response) => {
    logger.info('Registering drone', 'Drone Router');
    const registerDroneDto = new RegisterDroneDto(req.body);
    const validate = await validatePayload(registerDroneDto);
    if (validate.status === 'error') {
      res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
      logger.error(validate.errors.toString(), 'Drone Router');
    }

    const registerDrone = await dronesService.registerDrone(registerDroneDto);
    if (registerDrone.error) {
      res.status(registerDrone.status).json({
        status: 'error',
        message: registerDrone.error,
      });
      logger.error(registerDrone.error, 'Drone Router');
    }
    res.status(201).json({
      status: 'success',
      message: 'Drone registered successfully',
      data: registerDrone,
    });
    logger.info('Drone registered successfully', 'Drone Router');
  },
);

dronesRouter.get(
  '/:droneId',
  async (req: express.Request, res: express.Response) => {
    logger.info('Fetching drone', 'Drone Router');
    const droneId = req.params.droneId;
    const drone = await dronesService.getDroneById(droneId);
    if (drone.error || !drone.data) {
      res.status(drone.status).json({
        status: 'error',
        message: drone.error,
      });
      logger.error(drone.error, 'Drone Router');
    }
    res.status(200).json({
      status: 'success',
      message: 'Drone fetched successfully',
      data: drone,
    });
    logger.info('Drone fetched successfully', 'Drone Router');
  },
);

dronesRouter.post(
  '/load',
  async (req: LoadDroneWithMedicationReq, res: express.Response) => {
    logger.info('Loading drone with medication', 'Drone Router');
    const loadDroneWithMedicationDto = new LoadDroneWithMedicationDto(req.body);
    const validate = await validatePayload(loadDroneWithMedicationDto);

    if (validate.status === 'error') {
      res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
      logger.error(validate.errors.toString(), 'Drone Router');
    }

    const loadDroneWithMedication = await dronesService.loadDroneWithMedication(
      loadDroneWithMedicationDto,
    );
    if (loadDroneWithMedication.error) {
      res.status(loadDroneWithMedication.status).json({
        status: 'error',
        message: loadDroneWithMedication.error,
      });
      logger.error(loadDroneWithMedication.error, 'Drone Router');
    }
    res.status(201).json({
      status: 'success',
      message: 'Drone loaded successfully',
      data: loadDroneWithMedication,
    });
    logger.info('Drone loaded successfully', 'Drone Router');
  },
);

dronesRouter.get(
  '/:droneId/loaded-medications',
  async (req: express.Request, res: express.Response) => {
    logger.info('Fetching loaded drones', 'Drone Router');
    const droneId = req.params.droneId;
    const loadedDrones = await dronesService.getLoadedDroneMedications(droneId);
    if (loadedDrones.error) {
      res.status(loadedDrones.status).json({
        status: 'error',
        data: loadedDrones.error,
      });
      logger.error(loadedDrones.error, 'Drone Router');
    }
    res.status(200).json({
      status: 'success',
      message: 'Loaded drones fetched successfully',
      data: loadedDrones.data,
    });
    logger.info('Loaded drones fetched successfully', 'Drone Router');
  },
);

dronesRouter.get(
  '/available',
  async (req: express.Request, res: express.Response) => {
    logger.info('Fetching available drones', 'Drone Router');
    const availableDrones = await dronesService.availableDronesForLoading();
    if (availableDrones.error) {
      res.status(availableDrones.status).json({
        status: 'error',
        data: availableDrones.error,
      });
      logger.error(availableDrones.error, 'Drone Router');
    }
    res.status(200).json({
      status: 'success',
      message: 'Available drones fetched successfully',
      data: availableDrones,
    });
    logger.info('Available drones fetched successfully', 'Drone Router');
  },
);

dronesRouter.get(
  '/:droneId/battery-level',
  async (req: express.Request, res: express.Response) => {
    logger.info('Fetching drone battery level', 'Drone Router');
    const droneId = req.params.droneId;
    const loadedDrones = await dronesService.droneBatterylevel(droneId);
    if (loadedDrones.error) {
      res.status(loadedDrones.status).json({
        status: 'error',
        data: loadedDrones.error,
      });
      logger.error(loadedDrones.error, 'Drone Router');
    }
    res.status(200).json({
      status: 'success',
      message: 'Loaded drones fetched successfully',
      data: loadedDrones,
    });
    logger.info('Drone battery level fetched successfully', 'Drone Router');
  },

  dronesRouter.put(
    '/:droneId/updateState',
    async (req: express.Request, res: express.Response) => {
      logger.info('Updating drones state', 'Drone Router');
      const droneId = req.params.droneId;
      const updateStateDto = new DroneStateDto(req.body);

      const validate = await validatePayload(updateStateDto);
      if (validate.status === 'error') {
        res.status(400).json({
          status: 'error',
          message: 'Invalid payload',
          data: validate.errors,
        });
        logger.error(validate.errors.toString(), 'Drone Router');
      }
      const updateState = await dronesService.setDroneState(
        droneId,
        updateStateDto,
      );
      if (updateState.error) {
        res.status(updateState.status).json({
          status: 'error',
          data: updateState.error,
        });
        logger.error(updateState.error, 'Drone Router');
      }
      res.status(200).json({
        status: 'success',
        message: 'Drones state updated successfully',
        data: updateState.data,
      });
      logger.info('Drones state updated successfully', 'Drone Router');
    },
  ),
);

export default (app: express.Router) => {
  app.use('/drones', dronesRouter);
};
