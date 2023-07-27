import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { BaseDto } from './base.dto';
import { Request } from 'express';

interface ICreateMedicationDto {
  name: string;
  weight: number;
  image: string;
  droneId: string;
}

export class CreateMedicationDto
  extends BaseDto
  implements ICreateMedicationDto
{
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Name should only contain letters, numbers, "-", and "_"',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @IsNotEmpty()
  image: string;

  @IsUUID(4, { message: 'Invalid Drone ID' })
  @IsNotEmpty({ message: 'Drone ID is required' })
  droneId: string;

  constructor(data: ICreateMedicationDto) {
    super();
    this.name = data.name;
    this.weight = data.weight;
    this.image = data.image;
    this.droneId = data.droneId;
  }
}

export interface CreateMedicationReq extends Request {
  body: ICreateMedicationDto;
  params: any;
  query: any;
}
