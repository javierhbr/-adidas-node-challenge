import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    const response: CustomError = {
      code: 'bad-request-error',
      message,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}
