import { Response } from 'express';
import HttpStatus from 'http-status-codes';

export class HttpResponse {
  createdResponse(res: Response, message: string, data: any) {
    return res.status(HttpStatus.CREATED).json({
      success: true,
      statusCode: HttpStatus.CREATED,
      message,
      data,
    });
  }

  okResponse(res: Response, message: string, data: any) {
    return res.status(HttpStatus.OK).json({
      success: true,
      statusCode: HttpStatus.OK,
      message,
      data,
    });
  }
}
