import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CompleteChallengeDto } from './dto/complete-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengesService } from './challenges.service';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challenges: ChallengesService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.challenges.getById(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteChallengeDto) {
    return this.challenges.complete(id, dto);
  }

  @Patch(':id')
  updateNote(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.challenges.updateNote(id, dto);
  }
}
