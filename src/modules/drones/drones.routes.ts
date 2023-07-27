import { Drone } from '@prisma/client';
import * as express from 'express';

const dronesRouter = express.Router();

export default (app: express.Router) => {
  app.use('/drones', dronesRouter);
};
