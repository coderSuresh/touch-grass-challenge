import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AdaptationContext,
  AdaptedChallenges,
  AIProvider,
  GeneratedPlan,
  PlanGenerationContext,
  ReflectionContext,
} from './ai.types';
import {
  validateAdaptedChallenges,
  validateGeneratedPlan,
  validateReflection,
} from './ai.validation';
import { monthlyPlanPrompt } from './prompts/monthly-plan.prompt';
import { adaptChallengesPrompt } from './prompts/adapt-challenges.prompt';
import { reflectionPrompt } from './prompts/reflection.prompt';

@Injectable()
export class OllamaProvider implements AIProvider {
  private readonly logger = new Logger(OllamaProvider.name);

  constructor(private readonly config: ConfigService) {}

  async generatePlan(context: PlanGenerationContext): Promise<GeneratedPlan> {
    const value = await this.generateJson(
      monthlyPlanPrompt(JSON.stringify(context)),
    );
    return validateGeneratedPlan(value);
  }

  async adaptChallenges(
    context: AdaptationContext,
  ): Promise<AdaptedChallenges> {
    const expectedIds = new Set(
      context.incomplete.map((challenge) => challenge.id),
    );
    const value = await this.generateJson(
      adaptChallengesPrompt(JSON.stringify(context)),
    );
    return validateAdaptedChallenges(value, expectedIds);
  }

  async generateReflection(context: ReflectionContext): Promise<string> {
    return validateReflection(
      await this.generateText(reflectionPrompt(JSON.stringify(context))),
    );
  }

  private async generateJson(prompt: string): Promise<unknown> {
    const text = await this.generateText(prompt);
    try {
      return JSON.parse(
        text.replace(/^```json\s*|```$/g, '').trim(),
      ) as unknown;
    } catch {
      throw new BadGatewayException('AI returned malformed JSON.');
    }
  }

  private async generateText(prompt: string): Promise<string> {
    const baseUrl = this.config.get<string>(
      'OLLAMA_BASE_URL',
      'http://localhost:11434',
    );
    const model = this.config.get<string>('OLLAMA_MODEL', 'gemma4:7.5b');
    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, '')}/api/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            format: 'json',
          }),
        },
      );
      if (!response.ok)
        throw new Error(`Ollama responded with ${response.status}`);
      const body = (await response.json()) as { response?: unknown };
      if (typeof body.response !== 'string')
        throw new Error('Ollama response was missing text');
      return body.response;
    } catch (error) {
      this.logger.error(
        `AI provider failure: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
      throw new BadGatewayException('The AI provider is unavailable.');
    }
  }
}
