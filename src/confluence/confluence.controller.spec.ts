import { Test, TestingModule } from '@nestjs/testing';
import { ConfluenceController } from './confluence.controller';

describe('Confluence Controller', () => {
  let controller: ConfluenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfluenceController],
    }).compile();

    controller = module.get<ConfluenceController>(ConfluenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
