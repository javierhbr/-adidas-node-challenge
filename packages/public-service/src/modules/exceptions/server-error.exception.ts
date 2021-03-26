import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class ServerErrorException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: '9999',
      message: 'Internal Server Error',
      details,
    };
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
