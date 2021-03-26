import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ServerErrorException } from '../server-error.exception';
import { AuthErrorException } from '../auth-error.exception';

import { CustomError } from '../interfaces/custom-error.interface';
import { DATE_FORMAT, formatDateToString } from '../../utils/date-time.utils';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter<HttpException> {
  error: HttpException;
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const { authInfo } = request;
    if (authInfo) {
      exception = new AuthErrorException(authInfo.message);
    }

    this.error =
      exception instanceof HttpException
        ? exception
        : new ServerErrorException(
            'There was an internal server error. ' +
              'Please contact your administrator if the problem persists.',
          );

    this.logger.error(
      `${request.method} error: ${request.url}  - ${
        exception.message
      } - ${JSON.stringify(this.error.getResponse())} : ${exception.stack}`,
    );
    const errorDetails: CustomError = this.error.getResponse() as CustomError;

    response.status(this.error.getStatus()).json({
      error: { code: errorDetails.code, message: errorDetails.message },
      timestamp: formatDateToString(new Date(), DATE_FORMAT),
      path: request.url,
    });
  }
}
