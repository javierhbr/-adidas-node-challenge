import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class DownstreamErrorException extends HttpException {
  constructor(details: any) {
    const response: CustomError = {
      code: '8888',
      message: 'oops, something happened, please try in a few minutes',
      details,
    };
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
