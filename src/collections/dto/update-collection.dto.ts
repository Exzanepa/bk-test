import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}