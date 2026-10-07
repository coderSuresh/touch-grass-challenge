import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CompleteChallengeDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
