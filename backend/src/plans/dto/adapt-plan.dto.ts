import { IsNotEmpty, IsString } from 'class-validator';

export class AdaptPlanDto {
  @IsString()
  @IsNotEmpty()
  constraint!: string;
}
