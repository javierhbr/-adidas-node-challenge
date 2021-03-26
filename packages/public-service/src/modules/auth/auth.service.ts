import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

import { AuthErrorException } from '../exceptions';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { DATE_FORMAT } from '../utils/date-time.utils';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username: string = authCredentialsDto.username;
    if (!username) {
      throw new AuthErrorException('Invalid credentials');
    }
    const payload: JwtPayload = AuthService.buildJwtPayload(username);
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  private static buildJwtPayload(user: string): JwtPayload {
    const currentDate: moment.Moment = moment(new Date());
    return {
      username: user,
      lastLogin: moment(new Date()).format(DATE_FORMAT),
      loginDate: currentDate.format(DATE_FORMAT),
      expiresIn: '360d',
      expireDate: currentDate.add(360, 'days').format(DATE_FORMAT),
    };
  }
}
