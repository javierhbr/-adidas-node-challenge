import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class TokenExpiredException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'token-expired',
      message: 'Not Authorized',
      details,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
