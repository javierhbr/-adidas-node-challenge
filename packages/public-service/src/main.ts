import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { AllExceptionsFilter } from './modules/exceptions';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'verbose', 'warn'],
  });

  const isSwaggerEnable: boolean =
    process.env.ENABLE_SWAGGER || serverConfig.enable_swagger;
  const isCorsEnable: boolean = process.env.CORS_ORIGIN || serverConfig.origin;

  if (isCorsEnable) {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  } else {
    app.enableCors();
  }

  logger.log(`Enabling SWAGGER "${isSwaggerEnable}"`);
  if (isSwaggerEnable) {
    setupSwagger(app);
  }

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
