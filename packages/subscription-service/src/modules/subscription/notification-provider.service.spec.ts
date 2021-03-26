import { Test, TestingModule } from '@nestjs/testing';
import { NotificationProvider } from './notification-provider.service';
import { SubscriptionDto } from './dto/subscription.dto';
import { GenderEnum } from '../common/gender.enum';

describe('NotificationProvider', () => {
  let notificationProvider: NotificationProvider;

  const sendNotificationMock = jest
    .fn()
    .mockResolvedValueOnce(Promise.resolve());
  class NotificationService {
    static sendNotification = sendNotificationMock;
  }

  const inputSubscription: SubscriptionDto = {
    email: 'test@gmail.com',
    firstName: 'string',
    dateOfBird: '1983-06-28',
    gender: GenderEnum.NON_INDICATED,
    isConsent: true,
    newsletterId: 'string',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationProvider,
        {
          provide: NotificationService.name,
          useValue: NotificationService,
        },
        {
          provide: 'notificationPatter',
          useValue: 'testPatter',
        },
      ],
    }).compile();

    notificationProvider = module.get<NotificationProvider>(
      NotificationProvider,
    );
  });
  it('should be defined', () => {
    expect(notificationProvider).toBeDefined();
  });

  describe('notifyNewSubscription', () => {
    it('should handler error from sendNotification', async () => {
      jest
        .spyOn(NotificationService, 'sendNotification')
        .mockRejectedValueOnce(() =>
          Promise.reject(new Error('send notificationError')),
        );
      await expect(
        notificationProvider.notifyNewSubscription(inputSubscription),
      ).resolves;
      expect(NotificationService.sendNotification).toBeCalled();
    });

    it('should send a Notification', async () => {
      await expect(
        notificationProvider.notifyNewSubscription(inputSubscription),
      ).resolves;
      expect(NotificationService.sendNotification).toBeCalled();
    });
  });

  describe('notifySubscriptionDeletion', () => {
    it('should handler error from sendNotification', async () => {
      jest
        .spyOn(NotificationService, 'sendNotification')
        .mockRejectedValueOnce(() =>
          Promise.reject(new Error('send notificationError')),
        );
      await expect(
        notificationProvider.notifySubscriptionDeletion(inputSubscription),
      ).resolves;
      expect(NotificationService.sendNotification).toBeCalled();
    });

    it('should send a Notification', async () => {
      await expect(
        notificationProvider.notifySubscriptionDeletion(inputSubscription),
      ).resolves;
      expect(NotificationService.sendNotification).toBeCalled();
    });
  });
});
