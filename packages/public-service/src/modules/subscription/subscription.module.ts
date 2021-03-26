import { HttpModule, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionProvider } from './subscription.provider';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionProvider],
})
export class SubscriptionModule {}
