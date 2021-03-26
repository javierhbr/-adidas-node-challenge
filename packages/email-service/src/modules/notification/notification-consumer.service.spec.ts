import { Test, TestingModule } from '@nestjs/testing';
import { IncomingNotificationDto } from './dto/incoming-notification.dto';
import { NotificationTypeEnum } from '../common/notification-type.enum';
import { NotificationConsumerService } from './notification-consumer.service';

describe('NotificationConsumerService', () => {
  let notificationConsumerService: NotificationConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationConsumerService],
    }).compile();

    notificationConsumerService = module.get<NotificationConsumerService>(
      NotificationConsumerService,
    );
  });

  it('should be defined', () => {
    expect(notificationConsumerService).toBeDefined();
  });

  it('should process message processNotification', async () => {
    const data: IncomingNotificationDto = {
      notificationType: NotificationTypeEnum.EMAIL,
      destination: 'destination',
      message: 'message',
    };
    const context: any = {
      getChannelRef: () => jest.fn(),
      getMessage: () => {
        ack: () => jest.fn();
      },
    };
    await expect(() =>
      notificationConsumerService.processNotification(data, context),
    ).not.toThrow();
  });

  it('should process message processNotification handling error', async () => {
    const data: IncomingNotificationDto = {
      notificationType: NotificationTypeEnum.EMAIL,
      destination: 'destination',
      message: 'message',
    };
    const context: any = {
      getChannelRef: () => jest.fn().mockRejectedValue(new Error()),
      getMessage: () => {
        ack: () => jest.fn();
      },
    };
    await expect(() =>
      notificationConsumerService.processNotification(data, context),
    ).not.toThrow();
  });
});
