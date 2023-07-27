import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as cors from 'cors';
import config from './config';
import { AllExceptionsFilter } from './exceptions/http-exception.filter';
import routes from './modules/index';

export const createApp = (): express.Application => {
  const app: express.Application = express();
  app.enable('trust proxy');
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((err, req, res, next) => {
    const exceptionFilter = new AllExceptionsFilter();
    exceptionFilter.catch(err, req, res, next);
  });
  app.use(config.api.prefix, routes());

  app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Hello World!',
      data: null,
    });
  });

  const exceptionFilter = new AllExceptionsFilter();
  app.use((err, req: Request, res: Response, next: NextFunction) => {
    exceptionFilter.catch(err, req, res, next);
    next();
  });

  return app;
};
