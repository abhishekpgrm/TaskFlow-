import { IsOptional, IsString, IsIn, IsArray, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['TODO', 'IN_PROGRESS', 'COMPLETED'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  reporterId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
