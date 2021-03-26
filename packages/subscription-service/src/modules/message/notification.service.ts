import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IMessage, INotification } from '../interface/notification.interface';

@Injectable()
export class NotificationService implements INotification {
  constructor(
    @Inject('notification-mq-action') private readonly client: ClientProxy,
  ) {}

  sendNotification(pattern: string, data: IMessage) {
    return this.client.emit(pattern, data).toPromise();
  }
}
