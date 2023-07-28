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
      logger.error(validate.errors.toString(), 'Medication Router');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
    }

    const registerDrone = await MedicationService.createMedication(
      createMedicationDto,
    );
    if (registerDrone.error) {
      logger.error(registerDrone.error, 'Medication Router');
      return res.status(registerDrone.status).json({
        status: 'error',
        message: registerDrone.error,
      });
    }
    logger.info('Drone registered successfully', 'Medication Router');
    return res.status(201).json({
      status: 'success',
      message: 'Drone registered successfully',
      data: registerDrone,
    });
  },
);

export default (app: express.Router) => {
  app.use('/medications', medicationRouter);
};
