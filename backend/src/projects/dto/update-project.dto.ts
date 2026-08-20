import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'])
  priority?: string;
}
