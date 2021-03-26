import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as config from 'config';

const notificationConfig = config.get('notification-conf');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'notification-mq-action',
        transport: Transport.RMQ,
        options: {
          urls: notificationConfig.urls,
          queue: notificationConfig.queue,
        },
      },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
