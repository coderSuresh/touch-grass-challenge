import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateChallengeDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string | null;
}
