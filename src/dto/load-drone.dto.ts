import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
} from 'class-validator';
import { BaseDto } from './base.dto';
import { Request } from 'express';

interface ILoadDroneWithMedicationDto {
  droneId: string;
  weight: number;
  name: string;
  image: string;
}

export class LoadDroneWithMedicationDto
  extends BaseDto
  implements ILoadDroneWithMedicationDto
{
  @IsUUID(4, { message: 'Invalid Drone ID' })
  @IsNotEmpty({ message: 'Drone ID is required' })
  droneId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Name should only contain letters, numbers, "-", and "_"',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  weight: number;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  constructor(data: ILoadDroneWithMedicationDto) {
    super();
    this.droneId = data.droneId;
    this.weight = data.weight;
    this.name = data.name;
    this.image = data.image;
  }
}

export interface LoadDroneWithMedicationReq extends Request {
  body: ILoadDroneWithMedicationDto;
  params: any;
  query: any;
}
