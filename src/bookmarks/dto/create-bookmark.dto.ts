import { IsNotEmpty, IsString, IsUrl, IsOptional, IsUUID } from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  collectionId: string;
}