import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './modules/exceptions';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { HttpModule } from './modules/http/http.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [AuthModule, HttpModule, SubscriptionModule],
})
export class AppModule {}
