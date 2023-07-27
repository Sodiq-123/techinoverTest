import { DroneModel } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from './base.dto';
import { Request } from 'express';

interface IRegisterDroneDto {
  model: DroneModel;
  weightLimit: string;
  batteryCapacity: number;
}

export class RegisterDroneDto extends BaseDto implements IRegisterDroneDto {
  @IsEnum(DroneModel, { message: 'Invalid Drone Model Type' })
  @IsNotEmpty()
  model: DroneModel;

  @IsString()
  @IsNotEmpty()
  weightLimit: string;

  @IsNumber()
  @IsNotEmpty()
  batteryCapacity: number;

  constructor(data: IRegisterDroneDto) {
    super();
    this.model = data.model;
    this.weightLimit = data.weightLimit;
    this.batteryCapacity = data.batteryCapacity;
  }
}

export interface RegisterDroneReq extends Request {
  body: IRegisterDroneDto;
  params: any;
  query: any;
}
