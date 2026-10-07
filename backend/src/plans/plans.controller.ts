import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AdaptPlanDto } from './dto/adapt-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { NextPlanDto } from './dto/next-plan.dto';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.plans.create(dto);
  }

  @Get('current')
  current(@Query('planId') planId?: string) {
    return this.plans.current(planId);
  }

  @Post(':id/adapt')
  adapt(@Param('id') id: string, @Body() dto: AdaptPlanDto) {
    return this.plans.adapt(id, dto);
  }

  @Post(':id/next')
  next(@Param('id') id: string, @Body() dto: NextPlanDto) {
    return this.plans.next(id, dto);
  }
}
