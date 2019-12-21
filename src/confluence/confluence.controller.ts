import {
  Controller,
  Post,
  Req,
  Query,
  Get,
  Redirect,
  Res,
} from '@nestjs/common';
import { CONFIG } from './config';
import Axios from 'axios';
import { Request } from 'express';

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
  @Get('/conf-callback')
  @Redirect('/authorize?code', 302)
  public async confCallback(@Req() request: Request, @Res() res) {
    try {
      res.redirect('/confluence/authorize?code=' + request.query['code']);
    } catch (err) {}
  }

  /**
   * Exchange Auth Grant for Auth Token
   *
   * @param  {any} request
   * @param  {string} code
   * @return {string} access_token
   * @memberof ConfluenceController
   */
  @Get('/authorize')
  public async authorize(
    @Req() request,
    @Query('code') code: string,
  ): Promise<string> {
    try {
      const reqBody = {
        code,
        grant_type: 'authorization_code',
        client_id: CONFIG.client_id,
        client_secret: CONFIG.client_secret,
        redirect_uri: CONFIG.redirect_uri,
      };

      const resp = await Axios.post(CONFIG.oauth_url, reqBody);
      const token = resp.data.access_token;
      const scope = resp.data.scope;
      console.log('TCL: ConfluenceController -> authorize -> token', token);
      // TODO: save token in session.
      return token;
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
