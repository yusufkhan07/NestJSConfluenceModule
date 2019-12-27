import {
  Controller,
  Post,
  Req,
  Query,
  Get,
  ParseIntPipe,
  Body,
  Session,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import Axios from 'axios';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { ConfluenceService } from './confluence.service';

import { OutSpacesDto, OutPageDto, CreatePageDto } from '.';

@ApiBadRequestResponse({})
@ApiTags('confluence')
@Controller('confluence')
export class ConfluenceController {
  constructor(private readonly confluenceService: ConfluenceService) {}

  /**
   * A callback function which receives the Auth Grant
   *
   * @param  {Request} request
   * @param  {any} res
   * @return {void}@memberof ConfluenceController
   */
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary:
      'Called by Confluence with Auth Grant Key. Exchange the code for AccessToken',
  })
  @Get('/conf-callback')
  public async confCallback(
    @Session() session: { accessToken: string | undefined },
    @Query('code') code: string,
  ): Promise<{
    accessToken: string;
  }> {
    try {
      const result = await this.confluenceService.confCallback(code);
      session.accessToken = result.accessToken;
      return {
        accessToken: result.accessToken,
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiUnauthorizedResponse({})
  @ApiForbiddenResponse({})
  @ApiOkResponse({
    type: OutSpacesDto,
  })
  @ApiQuery({
    name: 'start',
    type: Number,
    schema: {
      default: 0,
      example: 0,
    },
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    schema: {
      default: 25,
    },
  })
  @Get('/spaces')
  public async getSpaces(
    @Session() session: { accessToken: string | undefined },
    @Query('start', ParseIntPipe) start: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 25,
  ): Promise<OutSpacesDto> {
    if (session.accessToken === undefined) {
      throw new UnauthorizedException('Token is missing from session');
    }

    if (typeof start !== 'number') {
      start = 0;
    }

    if (typeof limit !== 'number') {
      limit = 25;
    }

    try {
      const result = await this.confluenceService.getSpaces(
        session.accessToken,
        start,
        limit,
      );

      return plainToClass(OutSpacesDto, result, {
        excludeExtraneousValues: true,
      });

      // return apiResponse;
    } catch (err) {
      throw err;
    }
  }

  @ApiUnauthorizedResponse({})
  @ApiForbiddenResponse({})
  @ApiOkResponse({
    type: OutPageDto,
  })
  @Post('/content')
  public async createPage(
    @Session() session: { accessToken: string | undefined },
    @Body() dto: CreatePageDto,
  ): Promise<OutPageDto> {
    if (session.accessToken === undefined) {
      throw new UnauthorizedException('Token is missing from session');
    }

    try {
      const result = await this.confluenceService.createPage(
        session.accessToken,
        dto,
      );
      return plainToClass(OutPageDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw err;
    }
  }
}
