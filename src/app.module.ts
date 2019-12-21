import { Module } from '@nestjs/common';
import { ConfluenceModule } from './confluence/confluence.module';

@Module({
  imports: [ConfluenceModule],
  controllers: [],
})
export class AppModule {}
