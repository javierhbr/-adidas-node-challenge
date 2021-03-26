import { Inject, Injectable, Logger } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import { IMessage } from '../interface/notification.interface';
import { NotificationTypeEnum } from '../common/notification-type.enum';
import { NotificationService } from '../message/notification.service';

@Injectable()
export class SubscriptionProvider {
  private logger = new Logger(SubscriptionProvider.name);

  constructor(
    private readonly messageService: NotificationService,
    @Inject('notificationPatter') private readonly notificationPatter: string,
  ) {}

  async notifyNewSubscription(subscription: SubscriptionDto): Promise<void> {
    const message: IMessage = {
      notificationType: NotificationTypeEnum.EMAIL,
      destination: subscription.email,
      message: 'Successfully added to a newsletter',
    };
    try {
      await this.messageService.sendNotification(
        'notification-mq-action',
        message,
      );
    } catch (error) {
      this.logger.error(
        `Error sending newsletter registration notification`,
        error,
      );
    }
  }

  async notifyRemoveSubscription(subscription: SubscriptionDto): Promise<void> {
    const message: IMessage = {
      notificationType: NotificationTypeEnum.EMAIL,
      destination: subscription.email,
      message: 'Successfully removed from newsletter',
    };
    try {
      await this.messageService.sendNotification(
        'notification-mq-action',
        message,
      );
    } catch (error) {
      this.logger.error(
        `Error sending newsletter cancelation notification`,
        error,
      );
    }
  }
}
