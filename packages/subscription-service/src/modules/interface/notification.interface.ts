import { NotificationTypeEnum } from '../common/notification-type.enum';

export interface INotification {
  sendNotification(pattern: string, data: IMessage): void;
}

export interface IMessage {
  notificationType: NotificationTypeEnum;
  destination: string;
  message: string;
}
