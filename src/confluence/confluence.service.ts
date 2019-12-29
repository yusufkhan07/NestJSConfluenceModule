import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import Axios from 'axios';

import {
  CONFIG,
  PageBodyDto,
  CreatePageDto,
  PostContentResponseDto,
  GetSpacesResponseDto,
} from '.';

// imports for the tempplating
import * as Handlebars from 'handlebars';
import { pageTemplate } from './pageTemplate';
import { BoardDto } from './dto/board.dto';
import { plainToClass } from 'class-transformer';
Handlebars.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});

@Injectable()
export class ConfluenceService {
  public async confCallback(
    code: string,
  ): Promise<{
    accessToken: string;
  }> {
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

  public async getSpaces(
    accessToken: string,
    start: number = 0,
    limit: number = 25,
  ): Promise<GetSpacesResponseDto> {
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

      return {
        limit: apiResponse.data.limit,
        start: apiResponse.data.start,
        size: apiResponse.data.size,
        results: apiResponse.data.results,
        _links: apiResponse.data._links,
      };

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

  // convert json into XHTML
  private _bodyFactory(body: BoardDto): string {
    const template = Handlebars.compile(pageTemplate);

    const compiledPage = template({
      logo:
        'https://github.com/NoumanDilshad/images/blob/master/logo.png?raw=true',
      date: body.createdAt.toLocaleDateString(),
      title: body.name,
      percentage: body.participationRate * 100,
      actionItems: body.actionItems.map(x => ({
        selected: x.selected,
        text: x.text,
      })),
      retrospective: body.columns.map(x => ({
        title: x.name,
        items: x.rows.map(y => y.text),
      })),
    });

    return compiledPage;
  }

  public async createPage(
    accessToken: string,
    spaceKey: string,
    dto: BoardDto,
  ): Promise<PostContentResponseDto> {
    if (dto instanceof BoardDto === false) {
      dto = plainToClass(BoardDto, dto);
    }

    const authStr = `Bearer ${accessToken}`;

    const reqBody = {
      type: 'page',
      title: dto.name,
      space: {
        key: spaceKey,
      },
      body: {
        storage: {
          value: this._bodyFactory(dto),
          representation: 'storage',
        },
      },
    };

    try {
      const apiResponse = await Axios.post(CONFIG.content_url, reqBody, {
        headers: {
          Authorization: authStr,
          'Content-Type': 'application/json',
        },
      });

      return {
        id: apiResponse.data.id as string,
        type: apiResponse.data.type as string,
        status: apiResponse.data.status as string,
        title: apiResponse.data.title as string,
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
}
