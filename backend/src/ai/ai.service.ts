import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER } from './ai.types';
import type { AIProvider } from './ai.types';

@Injectable()
export class AiService implements AIProvider {
  constructor(@Inject(AI_PROVIDER) private readonly provider: AIProvider) {}

  generatePlan = (context: Parameters<AIProvider['generatePlan']>[0]) =>
    this.provider.generatePlan(context);
  adaptChallenges = (context: Parameters<AIProvider['adaptChallenges']>[0]) =>
    this.provider.adaptChallenges(context);
  generateReflection = (
    context: Parameters<AIProvider['generateReflection']>[0],
  ) => this.provider.generateReflection(context);
}
