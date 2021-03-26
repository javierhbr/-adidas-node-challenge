import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class AuthErrorException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: '1000',
      message: 'Not Authorized',
      details,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
