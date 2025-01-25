import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIAdapter } from '@copilotkit/runtime';
import OpenAI from 'openai';

@Injectable()
export class AppService {
  readonly serviceAdapter: OpenAIAdapter;

  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get('OPENAI_API_KEY'));
    const openai = new OpenAI({
      apiKey: 'sk-1d1e92ee5d28471c8950843c0cd737f2', // this.configService.get('OPENAI_API_KEY'),
      baseURL: 'https://api.deepseek.com', // 'https://api.302.ai/v1/chat/completions',
    });
    this.serviceAdapter = new OpenAIAdapter({
      openai,
      model: 'deepseek-chat', //'gpt-4-turbo', // 'gpt-4o-plus',
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
