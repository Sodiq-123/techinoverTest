import * as express from 'express';
import { validatePayload } from '../../dto/index.dto';
import {
  CreateMedicationDto,
  CreateMedicationReq,
} from '../../dto/medication.dto';
import MedicationService from './medications.service';
import logger from '../../utils/logger';

const medicationRouter = express.Router();

medicationRouter.post(
  '/create',
  async (req: CreateMedicationReq, res: express.Response) => {
    logger.info('Registering medication for a drone', 'Medication Router');
    const createMedicationDto = new CreateMedicationDto(req.body);
    const validate = await validatePayload(createMedicationDto);
    if (validate.status === 'error') {
      res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
      logger.error(validate.errors.toString(), 'Medication Router');
    }

    const registerDrone = await MedicationService.createMedication(
      createMedicationDto,
    );
    if (registerDrone.error) {
      res.status(registerDrone.status).json({
        status: 'error',
        message: registerDrone.error,
      });
      logger.error(registerDrone.error, 'Medication Router');
    }
    res.status(201).json({
      status: 'success',
      message: 'Drone registered successfully',
      data: registerDrone,
    });
    logger.info('Drone registered successfully', 'Medication Router');
  },
);

export default (app: express.Router) => {
  app.use('/medications', medicationRouter);
};
