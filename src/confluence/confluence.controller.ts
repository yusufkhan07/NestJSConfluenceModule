import {
  Controller,
  Post,
  Req,
  Query,
  Get,
  Redirect,
  Res,
  ParseIntPipe,
  Body,
  Session,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import Axios from 'axios';
import { Request } from 'express';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import {
  CONFIG,
  OutSpacesDto,
  OutPageDto,
  CreatePageDto,
  PageBodyDto,
} from '.';

@ApiBadRequestResponse({})
@ApiTags('confluence')
@Controller('confluence')
export class ConfluenceController {
  /**
   * A callback function which receives the Auth Grant & redirect
   * user to /confluence/authorize Page
   *
   *
   * @param  {Request} request
   * @param  {any} res
   * @return {void}@memberof ConfluenceController
   */
  @ApiOperation({
    summary: 'Called by Confluence with Auth Grant Key',
  })
  @Get('/conf-callback')
  public async confCallback(
    @Req() request: Request,
    @Res() res,
    @Query('code') code: string,
  ) {
    res.redirect('/confluence/authorize?code=' + code);
  }

  /**
   * Exchange Auth Grant for Auth Token
   *
   * @param  {any} request
   * @param  {string} code
   * @return {string} access_token
   * @memberof ConfluenceController
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
    summary: 'Exchange Grant Key for Access Token',
  })
  @Get('/authorize')
  public async authorize(
    @Session() session: { accessToken: string | undefined },
    @Req() request,
    @Query('code') code: string,
  ) {
    const reqBody = {
      code,
      grant_type: 'authorization_code',
      client_id: CONFIG.client_id,
      client_secret: CONFIG.client_secret,
      redirect_uri: CONFIG.redirect_uri,
    };

    try {
      const apiResponse = await Axios.post(CONFIG.oauth_url, reqBody);
      const token = apiResponse.data.access_token;
      const scope = apiResponse.data.scope;

      session.accessToken = token;

      return {
        accessToken: token,
      };
    } catch (err) {
      switch (err.response.status) {
        case 400:
          throw new BadRequestException(err.response.data.message);

        case 401:
          throw new UnauthorizedException(err.response.data.message);

        case 403:
          throw new ForbiddenException(err.response.data.message);

        default:
          throw err;
      }
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
    @Req() request,
    @Query('start', ParseIntPipe) start: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<OutSpacesDto> {
    if (session.accessToken === undefined) {
      throw new UnauthorizedException('Token is missing from session');
    }
    const accessToken = session.accessToken;

    if (typeof start !== 'number') {
      start = 0;
    }

    if (typeof limit !== 'number') {
      limit = 25;
    }

    const authStr = `Bearer ${accessToken}`;
    const queryParams = {
      status: 'current',
      start,
      limit,
    };

    try {
      const apiResponse = await Axios.get(CONFIG.spaces_url, {
        headers: { Authorization: authStr },
        params: queryParams,
      });

      return plainToClass(
        OutSpacesDto,
        {
          results: apiResponse.data.results,
          _links: apiResponse.data._links,
          limit: apiResponse.data.limit,
          start: apiResponse.data.start,
          size: apiResponse.data.size,
        },
        {
          excludeExtraneousValues: true,
        },
      );

      // return apiResponse;
    } catch (err) {
      switch (err.response.status) {
        case 400:
          throw new BadRequestException(err.response.data.message);

        case 401:
          throw new UnauthorizedException(err.response.data.message);

        case 403:
          throw new ForbiddenException(err.response.data.message);

        default:
          throw err;
      }
    }
  }

  //
  private _bodyFactory(body: PageBodyDto) {}

  @ApiUnauthorizedResponse({})
  @ApiForbiddenResponse({})
  @ApiOkResponse({
    type: OutPageDto,
  })
  @Post('/content')
  public async createPage(
    @Session() session: { accessToken: string | undefined },
    @Body() dto: CreatePageDto,
  ) {
    if (session.accessToken === undefined) {
      throw new UnauthorizedException('Token is missing from session');
    }
    const accessToken = session.accessToken;

    try {
      const authStr = `Bearer ${accessToken}`;

      const reqBody = {
        title: dto.title,
        type: 'page',
        space: {
          key: dto.spaceKey,
        },
        body: {
          storage: {
            value: this._bodyFactory(dto.body),
            representation: 'storage',
          },
        },
      };

      const apiResponse = await Axios.post(CONFIG.content_url, reqBody, {
        headers: {
          Authorization: authStr,
          'Content-Type': 'application/json',
        },
      });

      console.log(
        'TCL: ConfluenceController -> getSpaces -> apiResponse',
        apiResponse.data,
      );

      return plainToClass(
        OutSpacesDto,
        {
          results: apiResponse.data.results,
          _links: apiResponse.data._links,
          limit: apiResponse.data.limit,
          start: apiResponse.data.start,
          size: apiResponse.data.size,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (err) {
      switch (err.response.status) {
        case 400:
          throw new BadRequestException(err.response.data.message);

        case 401:
          throw new UnauthorizedException(err.response.data.message);

        case 403:
          throw new ForbiddenException(err.response.data.message);

        default:
          throw err;
      }
    }
  }
}
