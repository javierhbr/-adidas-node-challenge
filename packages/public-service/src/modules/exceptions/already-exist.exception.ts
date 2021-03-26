import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class AlreadyExistException extends HttpException {
  constructor(message: string, details: string | string[], data?: any) {
    const response: CustomError = {
      code: 'already-exist',
      details,
      message,
      data,
    };
    super(response, HttpStatus.CONFLICT);
  }
}
