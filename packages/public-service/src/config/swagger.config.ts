import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Public service')
    .setDescription('The Public API for subscription')
    .setVersion('0.0.1')
    .addTag('Subscriptions')
    .setContactEmail('javierhbr@gmail.com')
    .setBasePath('api')
    // .addBearerAuth('Authorization', 'header', 'Bearer')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-docs', app, document);
}
