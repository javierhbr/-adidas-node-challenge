import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class InvalidParameterException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'invalid-parameter',
      message: 'Bad Request',
      details,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}
