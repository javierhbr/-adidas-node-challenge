import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class NotificationConsumerService {
  private logger = new Logger(NotificationConsumerService.name);

  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification-mq-action')
  public async processNotification(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log(`processing message for ${data.destination}`);
      await this.notificationService.processNotification(data);
    } catch (error) {
      this.logger.error(
        `Error processing message ${data.destination}`,
        error.stack,
      );
    } finally {
      channel.ack(originalMessage);
    }
  }
}
