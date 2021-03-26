import { Inject, Injectable, Logger } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import { IMessage } from '../interface/notification.interface';
import { NotificationTypeEnum } from '../common/notification-type.enum';
import { NotificationService } from '../message/notification.service';

@Injectable()
export class NotificationProvider {
  private logger = new Logger(NotificationProvider.name);

  constructor(
    private readonly notificationService: NotificationService,
    @Inject('notificationPatter') private readonly notificationPatter: string,
  ) {}

  async notifyNewSubscription(subscription: SubscriptionDto): Promise<void> {
    const message: IMessage = {
      notificationType: NotificationTypeEnum.EMAIL,
      destination: subscription.email,
      message: 'Successfully added to a newsletter',
    };
    try {
      await this.notificationService.sendNotification(
        this.notificationPatter,
        message,
      );
    } catch (error) {
      this.logger.error(`Error sending notification of create`, error);
    }
  }

  async notifySubscriptionDeletion(
    subscription: SubscriptionDto,
  ): Promise<void> {
    const message: IMessage = {
      notificationType: NotificationTypeEnum.EMAIL,
      destination: subscription.email,
      message: 'removed from newsletter',
    };
    try {
      await this.notificationService.sendNotification(
        this.notificationPatter,
        message,
      );
    } catch (error) {
      this.logger.error(`Error sending notification pf removing`, error);
    }
  }
}
