import { Controller, Param, Post } from '@nestjs/common';
import { ReflectionsService } from './reflections.service';

@Controller('plans')
export class ReflectionsController {
  constructor(private readonly reflections: ReflectionsService) {}

  @Post(':id/reflection')
  generate(@Param('id') id: string) {
    return this.reflections.generate(id);
  }
}
