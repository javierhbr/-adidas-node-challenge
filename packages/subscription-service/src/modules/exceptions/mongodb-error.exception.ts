import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class MongodbErrorException extends HttpException {
  constructor(message: string, stack: any) {
    const response: CustomError = {
      code: '3333',
      message,
      details: stack,
    };
    super(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
