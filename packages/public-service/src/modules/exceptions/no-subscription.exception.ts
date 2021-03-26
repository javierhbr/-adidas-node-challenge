import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class NoSubscriptionException extends HttpException {
  constructor(code: string, message: string) {
    const response: CustomError = {
      code: code ?? '4569',
      message,
    };
    super(response, HttpStatus.NOT_FOUND);
  }
}
