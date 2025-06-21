import { IsString, MaxLength } from 'class-validator';

export class CreateMurmurDto {
  @IsString()
  @MaxLength(280)
  content: string;
}