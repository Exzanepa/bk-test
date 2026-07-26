import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class UpdateBookmarkDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  collectionId?: string;
}