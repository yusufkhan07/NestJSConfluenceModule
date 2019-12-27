import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ConfluenceController } from './confluence.controller';
import { ConfluenceModule } from './confluence.module';

describe('Confluence Controller', () => {
  let app: INestApplication;
  let controller: ConfluenceController;

  // Start the app
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfluenceModule],
    }).compile();

    app = module.createNestApplication();
    controller = app.get<ConfluenceController>(ConfluenceController);

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('confCallback', () => {
    it(`conf-callback require grant code`, async () => {
      const response = await request(app.getHttpServer()).get(
        '/confluence/conf-callback',
      );

      expect(response.status).toBe(400);
    });

    it(`conf-callback 403 on invalid grant`, async () => {
      const response = await request(app.getHttpServer()).get(
        '/confluence/conf-callback?code=invalidGrant',
      );

      expect(response.status).toBe(403);
    });
  });

  describe('get /spaces', () => {
    it(`get /spaces endpoint is valid`, async () => {
      const response = await request(app.getHttpServer()).get(
        '/confluence/spaces',
      );

      expect(response.status).not.toBe(404);
    });
  });

  describe('post /content ', () => {
    it(`post /content endpoint is valid`, async () => {
      const response = await request(app.getHttpServer()).post(
        '/confluence/content',
      );

      expect(response.status).not.toBe(404);
    });
  });
});
