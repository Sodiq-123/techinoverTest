import * as classValidator from 'class-validator';

export class BaseDto {
  async validate() {
    const errors = await classValidator.validate(this);
    return errors;
  }
}

export interface BaseReq extends Request {
  body: any;
  params: any;
  query: any;
}
