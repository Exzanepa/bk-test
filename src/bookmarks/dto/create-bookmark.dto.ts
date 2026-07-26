import { IsUrl, IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  collectionId?: string; 
}