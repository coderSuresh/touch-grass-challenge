import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
    imports: [AiModule],
    controllers: [PlansController],
    providers: [PlansService],
    exports: [PlansService],
})
export class PlansModule { }
