import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './modules/exceptions';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongoose.config';
import { NotificationModule } from './modules/message/notification.module';

@Module({
  providers: [
    MongooseConfig,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    SubscriptionModule,
    NotificationModule,
  ],
})
export class AppModule {}
