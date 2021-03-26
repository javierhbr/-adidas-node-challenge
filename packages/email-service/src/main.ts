import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { AllExceptionsFilter } from './modules/exceptions';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const subsTransportConfig = config.get('event-conf');
  const logger = new Logger('bootstrap');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: subsTransportConfig.urls,
      queue: subsTransportConfig.queue,
      noAck: false,
      prefetchCount: 1,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listenAsync();

  logger.log(`Application listening on servers: ${subsTransportConfig.urls}`);
}
bootstrap();
