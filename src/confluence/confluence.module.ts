import { Module } from '@nestjs/common';
import { NestSessionOptions, SessionModule } from 'nestjs-session';

import { ConfluenceController } from './confluence.controller';
import { ConfluenceService } from './confluence.service';
import { CONFIG } from './config';

@Module({
  imports: [
    SessionModule.forRoot({
      session: { secret: CONFIG.session_secret },
    }),
  ],
  controllers: [ConfluenceController],
  providers: [ConfluenceService],
})
export class ConfluenceModule {}
