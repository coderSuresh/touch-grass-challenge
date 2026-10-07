import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests!: string[];

  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  timePerDay?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  time?: string;

  @IsArray()
  @IsString({ each: true })
  motivations!: string[];

  get availableTime() {
    return this.timePerDay ?? this.time ?? '';
  }
}
