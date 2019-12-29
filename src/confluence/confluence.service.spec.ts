import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfluenceService } from './confluence.service';

import { CreatePageDto } from '.';
import { BoardDto } from './dto/board.dto';

describe('ConfluenceService', () => {
  let service: ConfluenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfluenceService],
    }).compile();

    service = module.get<ConfluenceService>(ConfluenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('confCallback', () => {
    it('should throw 403 when invalid auth grant', async () => {
      expect.assertions(1);
      try {
        await service.confCallback('randomInvalidCode');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('getSpaces', () => {
    it('should throw 401 when using expired token', async () => {
      expect.assertions(1);
      try {
        const expiredToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik16bERNemsxTVRoRlFVRTJRa0ZGT0VGRk9URkJOREJDTVRRek5EZzJSRVpDT1VKRFJrVXdNZyJ9.eyJodHRwczovL2F0bGFzc2lhbi5jb20vb2F1dGhDbGllbnRJZCI6ImRHMXQ0bjRTaGpaNWxZMzNTRldIbmxEaGh1Q3d6MlA1IiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2VtYWlsRG9tYWluIjoiZ21haWwuY29tIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL3N5c3RlbUFjY291bnRJZCI6IjVkZjVkNmNhNTg4ZjZlMGNiMDMyZWQ4MyIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9zeXN0ZW1BY2NvdW50RW1haWxEb21haW4iOiJjb25uZWN0LmF0bGFzc2lhbi5jb20iLCJodHRwczovL2F0bGFzc2lhbi5jb20vdmVyaWZpZWQiOnRydWUsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9maXJzdFBhcnR5IjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9hdGxhc3NpYW4tYWNjb3VudC1wcm9kLnB1czIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVkZjViZDcwY2NjZWQ3MGNiMmQ0YWMyYiIsImF1ZCI6ImFwaS5hdGxhc3NpYW4uY29tIiwiaWF0IjoxNTc3MjgxMTUxLCJleHAiOjE1NzcyODQ3NTEsImF6cCI6ImRHMXQ0bjRTaGpaNWxZMzNTRldIbmxEaGh1Q3d6MlA1Iiwic2NvcGUiOiJyZWFkOmNvbmZsdWVuY2Utc3BhY2Uuc3VtbWFyeSB3cml0ZTpjb25mbHVlbmNlLWNvbnRlbnQgcmVhZDpjb25mbHVlbmNlLWNvbnRlbnQuc3VtbWFyeSJ9.pF-QWeGtlDwJnafMzYfv2G7CrQFgZNE4MGRE1WYWevnuGhtqMJRO4QPThIPAwQ5X2_80QXIRBlMCnQNicvJygO-e98b0C9WHo3bVI4RigahyVqlXIhzouaXoYkjmUhkbz6v1Laa9XwiKWPjkeyewZ0dqCf9agMuQn2BkewvOmDvXhhIOKnAPcOmsGKFkmfXH8iz4o3zcLz4rH0F5VFmm3AseiZQTl3z62x7UKSyIhD8XMcQ-hXOcqa2i-gdvsj90F4PyM3IdlIqzkxceJw_tWIRG7ew5U9fKra5prspCnMjK92frIAXDmmLGY-dLfElLxGBsxqtv4AhuLUP1Ved35w`;
        await service.getSpaces(expiredToken, 0, 25);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw 403 when invalid token', async () => {
      expect.assertions(1);
      try {
        await service.getSpaces('RANDOM_TOKEN', 0, 25);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('createPage', () => {
    it('should throw 401 when using expired token', async () => {
      expect.assertions(1);
      try {
        const expiredToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik16bERNemsxTVRoRlFVRTJRa0ZGT0VGRk9URkJOREJDTVRRek5EZzJSRVpDT1VKRFJrVXdNZyJ9.eyJodHRwczovL2F0bGFzc2lhbi5jb20vb2F1dGhDbGllbnRJZCI6ImRHMXQ0bjRTaGpaNWxZMzNTRldIbmxEaGh1Q3d6MlA1IiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2VtYWlsRG9tYWluIjoiZ21haWwuY29tIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL3N5c3RlbUFjY291bnRJZCI6IjVkZjVkNmNhNTg4ZjZlMGNiMDMyZWQ4MyIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9zeXN0ZW1BY2NvdW50RW1haWxEb21haW4iOiJjb25uZWN0LmF0bGFzc2lhbi5jb20iLCJodHRwczovL2F0bGFzc2lhbi5jb20vdmVyaWZpZWQiOnRydWUsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9maXJzdFBhcnR5IjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9hdGxhc3NpYW4tYWNjb3VudC1wcm9kLnB1czIuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVkZjViZDcwY2NjZWQ3MGNiMmQ0YWMyYiIsImF1ZCI6ImFwaS5hdGxhc3NpYW4uY29tIiwiaWF0IjoxNTc3MjgxMTUxLCJleHAiOjE1NzcyODQ3NTEsImF6cCI6ImRHMXQ0bjRTaGpaNWxZMzNTRldIbmxEaGh1Q3d6MlA1Iiwic2NvcGUiOiJyZWFkOmNvbmZsdWVuY2Utc3BhY2Uuc3VtbWFyeSB3cml0ZTpjb25mbHVlbmNlLWNvbnRlbnQgcmVhZDpjb25mbHVlbmNlLWNvbnRlbnQuc3VtbWFyeSJ9.pF-QWeGtlDwJnafMzYfv2G7CrQFgZNE4MGRE1WYWevnuGhtqMJRO4QPThIPAwQ5X2_80QXIRBlMCnQNicvJygO-e98b0C9WHo3bVI4RigahyVqlXIhzouaXoYkjmUhkbz6v1Laa9XwiKWPjkeyewZ0dqCf9agMuQn2BkewvOmDvXhhIOKnAPcOmsGKFkmfXH8iz4o3zcLz4rH0F5VFmm3AseiZQTl3z62x7UKSyIhD8XMcQ-hXOcqa2i-gdvsj90F4PyM3IdlIqzkxceJw_tWIRG7ew5U9fKra5prspCnMjK92frIAXDmmLGY-dLfElLxGBsxqtv4AhuLUP1Ved35w`;
        await service.createPage(expiredToken, 'TEST', new BoardDto());
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw 403 when invalid token', async () => {
      expect.assertions(1);
      try {
        await service.createPage('RANDOM_TOKEN', 'TEST', new BoardDto());
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
