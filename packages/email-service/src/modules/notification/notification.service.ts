import { Injectable, Logger } from '@nestjs/common';
import { IncomingNotificationDto } from './dto/incoming-notification.dto';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  processNotification(notification: IncomingNotificationDto): Promise<void> {
    this.logger.log(`Process Notification ==> ${JSON.stringify(notification)}`);
    return;
  }
}
