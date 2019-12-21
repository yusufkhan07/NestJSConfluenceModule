import { Module } from '@nestjs/common';
import { ConfluenceController } from './confluence.controller';
import { ConfluenceService } from './confluence.service';

@Module({
  controllers: [ConfluenceController],
  providers: [ConfluenceService]
})
export class ConfluenceModule {}
