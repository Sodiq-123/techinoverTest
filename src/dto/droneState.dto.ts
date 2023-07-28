import { DroneState } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';
import { Request } from 'express';

interface IDroneStateDto {
  state: DroneState;
}

export class DroneStateDto extends BaseDto implements IDroneStateDto {
  @IsEnum(DroneState, { message: 'Invalid Drone State Type' })
  @IsNotEmpty()
  state: DroneState;

  constructor(data: IDroneStateDto) {
    super();
    this.state = data.state;
  }
}

export interface DroneStateReq extends Request {
  body: IDroneStateDto;
  params: any;
  query: any;
}
