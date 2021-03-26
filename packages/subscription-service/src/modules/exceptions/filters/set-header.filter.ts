import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class SetHeaderExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      error instanceof HttpException ? error.getStatus() : HttpStatus.FORBIDDEN;

    if (!request.get('x-api-key')) {
      response.setHeader(
        'WWW-Authenticate',
        'Internal realm="internal", title="Internal use only"',
      );
      response.status(HttpStatus.UNAUTHORIZED).json({
        errors: [(error as HttpException).getResponse()],
      });
    } else {
      if (request.get('WWW-Authenticate')) {
        // if exist remove it
        delete request.headers['WWW-Authenticate'];
      }
      response.status(status).json({
        errors: [(error as HttpException).getResponse()],
      });
    }
  }
}
