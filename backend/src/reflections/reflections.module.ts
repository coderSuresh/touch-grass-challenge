import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { PlansModule } from '../plans/plans.module';
import { ReflectionsController } from './reflections.controller';
import { ReflectionsService } from './reflections.service';

@Module({
    imports: [PlansModule, AiModule],
    controllers: [ReflectionsController],
    providers: [ReflectionsService],
})
export class ReflectionsModule { }
