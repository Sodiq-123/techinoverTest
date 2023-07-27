import * as express from 'express';
import droneRoutes from './drones/drones.routes';

export default () => {
  const baseRouter = express.Router();
  droneRoutes(baseRouter);
  return baseRouter;
};
