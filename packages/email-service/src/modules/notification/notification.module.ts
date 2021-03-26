import { Module } from '@nestjs/common';
import { NotificationConsumerService } from './notification-consumer.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, NotificationConsumerService],
})
export class NotificationModule {}
