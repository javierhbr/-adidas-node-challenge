import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class NoSubscriptionException extends HttpException {
  constructor(message) {
    const response: CustomError = {
      code: '4569',
      message,
    };
    super(response, HttpStatus.NOT_FOUND);
  }
}
