import * as express from 'express';
import { validatePayload } from '../../dto/index.dto';
import {
  CreateMedicationDto,
  CreateMedicationReq,
} from '../../dto/medication.dto';
import MedicationService from './medications.service';

const medicationRouter = express.Router();

medicationRouter.post(
  '/create',
  async (req: CreateMedicationReq, res: express.Response) => {
    const createMedicationDto = new CreateMedicationDto(req.body);
    const validate = await validatePayload(createMedicationDto);
    if (validate.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
        data: validate.errors,
      });
    }

    const registerDrone = await MedicationService.createMedication(
      createMedicationDto,
    );
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
