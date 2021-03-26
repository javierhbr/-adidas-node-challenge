import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class NotFoundException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'not-found-error',
      message: 'Not Found',
      details,
    };
    super(response, HttpStatus.NOT_FOUND);
  }
}
