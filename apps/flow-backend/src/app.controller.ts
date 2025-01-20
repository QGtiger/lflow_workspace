import { All, Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import {
  CopilotRuntime,
  copilotRuntimeNestEndpoint,
} from '@copilotkit/runtime';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @All('/copilotkit')
  copilotkit(@Req() req: Request, @Res() res: Response) {
    try {
      const runtime = new CopilotRuntime({});
      const handler = copilotRuntimeNestEndpoint({
        runtime,
        serviceAdapter: this.appService.serviceAdapter,
        endpoint: '/copilotkit',
      });

      // @ts-expect-error 类型错误
      return handler(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
}
