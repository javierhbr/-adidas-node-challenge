import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class TokenMissingException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'token-missing',
      message: 'Bad Request',
      details,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}
