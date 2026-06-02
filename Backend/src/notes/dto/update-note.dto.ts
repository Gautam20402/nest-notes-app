import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  is_completed?: boolean;
}