import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interfaces/custom-error.interface';

export class ForbiddenErrorException extends HttpException {
  constructor(details: string) {
    const response: CustomError = {
      code: 'forbidden-error',
      message: 'Access Forbidden',
      details,
    };
    super(response, HttpStatus.FORBIDDEN);
  }
}
