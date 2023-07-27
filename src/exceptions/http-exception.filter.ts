/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class CustomHttpException extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AllExceptionsFilter {
  catch(exception, req: Request, res: Response, next: NextFunction) {
    const response = res;

    const status =
      exception instanceof CustomHttpException ? exception.status : 500;

    const errorFormat = {
      error: null,
      message: null,
      statusCode: null,
    };

    errorFormat.statusCode = status;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errors = [];
      if (exception.code === 'P2002') {
        const message = 'Unique constraint failed on the fields';
        errorFormat.message = message;
        const fields = (exception.meta.target as any[]).map((t: any) => t);
        for (const field of fields) {
          errors.push({
            [field]: `${field} is already in use`,
          });
        }
        errorFormat.error = errors;
      }
      return response.status(status).json(errorFormat);
    }

    if (!exception.response) {
      (errorFormat.message = exception.message),
        (errorFormat.error = exception.error);
      logger.error(errorFormat.toString(), `${status} Error`);
      return response.status(status).json(errorFormat);
    }

    // Handle 500-related errors
    if (status >= 500) {
      errorFormat.message = 'Internal server error';
      errorFormat.error = null;
      logger.error(errorFormat.toString(), 'Internal Server Error');
      return response.status(500).json(errorFormat);
    }

    const data = exception.response;

    errorFormat.message = data.message;
    errorFormat.error = data.error;

    logger.error(errorFormat.toString(), `${status} Error`);
    return response.status(status).json(errorFormat);
  }
}
