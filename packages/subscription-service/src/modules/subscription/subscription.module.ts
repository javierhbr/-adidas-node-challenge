import { HttpModule, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { NotificationProvider } from './notification-provider.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { NotificationModule } from '../message/notification.module';
import * as config from 'config';
const subsTransportConfig = config.get('notification-conf');

@Module({
  imports: [
    NotificationModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    NotificationProvider,
    SubscriptionRepository,
    {
      provide: 'notificationPatter', // this can be a symbol or a string
      useValue: subsTransportConfig.pattern,
    },
  ],
})
export class SubscriptionModule {}
