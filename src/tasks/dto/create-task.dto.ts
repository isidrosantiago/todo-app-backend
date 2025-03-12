import { Priority, Status } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(Status)
  status: Status;
}
