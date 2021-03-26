import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class NotImplementedException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'not-implemented',
      message: 'Not Implemented',
      details,
    };
    super(response, HttpStatus.NOT_IMPLEMENTED);
  }
}
