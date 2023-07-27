import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as cors from 'cors';
import config from './config';
import {
  AllExceptionsFilter,
  CustomHttpException,
} from './exceptions/http-exception.filter';
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
    const error = new CustomHttpException(404, 'Resource not found');
    return res.status(error.status).json({
      status: 'error',
      message: error.message,
    });
  });

  // handle 500 errors
  app.use((err, req: Request, res: Response, next: NextFunction) => {
    const exceptionFilter = new AllExceptionsFilter();
    exceptionFilter.catch(err, req, res, next);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  });

  return app;
};
