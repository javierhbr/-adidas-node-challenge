import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class TokenInvalidException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'token-invalid',
      message: 'Not Authorized',
      details,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
