import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OllamaProvider } from './ollama.provider';
import { AI_PROVIDER } from './ai.types';

@Module({
  providers: [
    OllamaProvider,
    { provide: AI_PROVIDER, useExisting: OllamaProvider },
    AiService,
  ],
  exports: [AiService],
})
export class AiModule {}
