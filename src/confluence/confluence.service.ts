import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CONFIG,
  PageBodyDto,
  CreatePageDto,
  PostContentResponseDto,
  GetSpacesResponseDto,
} from '.';
import Axios from 'axios';

// imports for the tempa
import { pageTemplate } from './pageTemplate';
import * as Handlebars from 'handlebars';
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
  private _bodyFactory(body: PageBodyDto): string {
    const template = Handlebars.compile(pageTemplate);

    const compiledPage = template(body);

    return compiledPage;
  }

  public async createPage(
    accessToken: string,
    dto: CreatePageDto,
  ): Promise<PostContentResponseDto> {
    const authStr = `Bearer ${accessToken}`;

    const reqBody = {
      type: 'page',
      title: dto.title,
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
