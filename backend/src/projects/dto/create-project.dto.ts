import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsIn(['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'])
  priority?: string;
}
