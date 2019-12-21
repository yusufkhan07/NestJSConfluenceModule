import {
  Controller,
  Post,
  Req,
  Query,
  Get,
  Redirect,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import Axios from 'axios';
import { Request } from 'express';
import { ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { CONFIG, OutSpacesDto } from '.';

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
  public async authorize(@Req() request, @Query('code') code: string) {
    try {
      const reqBody = {
        code,
        grant_type: 'authorization_code',
        client_id: CONFIG.client_id,
        client_secret: CONFIG.client_secret,
        redirect_uri: CONFIG.redirect_uri,
      };

      const apiResponse = await Axios.post(CONFIG.oauth_url, reqBody);
      const token = apiResponse.data.access_token;
      const scope = apiResponse.data.scope;

      return {
        accessToken: token,
      };
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data['error'] !== undefined
      ) {
        return err.response.data.error;
      } else {
        throw err;
      }
    }
  }

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
  @ApiResponse({
    type: OutSpacesDto,
  })
  @Get('/spaces')
  public async getSpaces(
    @Req() request,
    @Query('start', ParseIntPipe) start: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('accessToken') accessToken: string,
  ): Promise<OutSpacesDto> {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (typeof limit !== 'number') {
      limit = 25;
    }

    try {
      const authStr = `Bearer ${accessToken}`;
      const queryParams = {
        status: 'current',
        start,
        limit,
      };

      const apiResponse = await Axios.get(CONFIG.spaces_url, {
        headers: { Authorization: authStr },
        params: queryParams,
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

      // return apiResponse;
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data['error'] !== undefined
      ) {
        return err.response.data.error;
      } else {
        throw err;
      }
    }
  }
}
