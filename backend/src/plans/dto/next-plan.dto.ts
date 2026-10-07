import { IsIn } from 'class-validator';

export class NextPlanDto {
  @IsIn(['repeat', 'new', 'surprise'])
  mode!: 'repeat' | 'new' | 'surprise';
}
