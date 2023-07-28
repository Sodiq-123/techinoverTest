import { Request, Response } from 'express';
import * as express from 'express';
import * as cors from 'cors';
import config from './config';
import createRoutes from './modules/index';

export const createApp = (): express.Application => {
  const app: express.Application = express();
  app.enable('trust proxy');
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(config.api.prefix, createRoutes());

  app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Hello World!',
      data: null,
    });
  });

  // handle 404 errors
  app.use('*', (_, res: Response) => {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found',
    });
  });

  return app;
};
