import { SubscriptionProvider } from './subscription.provider';
import { NotificationService } from '../message/notification.service';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { GenderEnum } from '../../../../public-service/src/modules/common/gender.enum';
import { SubscriptionDto } from './dto/subscription.dto';

describe('SubscriptionProvider', () => {
  let subscriptionProvider: SubscriptionProvider;

  let sendNotificationMock = jest.fn();
  const notificationPatter: string = 'testNotificationPatter';

  class NotificationServiceMock extends NotificationService {
    static sendNotification = sendNotificationMock;
  }

  beforeEach(async () => {
    sendNotificationMock = jest.fn();
    subscriptionProvider = new SubscriptionProvider(
      new NotificationServiceMock(new ClientProxyMock()),
      notificationPatter,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should addNewSubscription handler error', async () => {
    const subscription: SubscriptionDto = {
      email: 'test@gmail.com',
      firstName: 'string',
      dateOfBird: '1983-06-28',
      gender: GenderEnum.NON_INDICATED,
      isConsent: true,
      newsletterId: 'string',
    };
    sendNotificationMock.mockRejectedValue(new Error());
    await expect(() =>
      subscriptionProvider.notifyNewSubscription(subscription),
    ).not.toThrow();
    expect(sendNotificationMock).toBeCalledTimes(0);
  });

  it('should execute addNewSubscription', async () => {
    const subscription: SubscriptionDto = {
      email: 'test@gmail.com',
      firstName: 'string',
      dateOfBird: '1983-06-28',
      gender: GenderEnum.NON_INDICATED,
      isConsent: true,
      newsletterId: 'string',
    };
    sendNotificationMock.mockRejectedValue(Promise.resolve());

    await expect(() =>
      subscriptionProvider.notifyNewSubscription(subscription),
    ).not.toThrow();

    expect(sendNotificationMock).toBeCalledTimes(0);
  });

  it('should notifyRemoveSubscription handler error', async () => {
    const subscription: SubscriptionDto = {
      email: 'test@gmail.com',
      firstName: 'string',
      dateOfBird: '1983-06-28',
      gender: GenderEnum.NON_INDICATED,
      isConsent: true,
      newsletterId: 'string',
    };
    sendNotificationMock.mockRejectedValue(new Error());
    await expect(() =>
      subscriptionProvider.notifyRemoveSubscription(subscription),
    ).not.toThrow();
    expect(sendNotificationMock).toBeCalledTimes(0);
  });

  it('should execute notifyRemoveSubscription', async () => {
    const subscription: SubscriptionDto = {
      email: 'test@gmail.com',
      firstName: 'string',
      dateOfBird: '1983-06-28',
      gender: GenderEnum.NON_INDICATED,
      isConsent: true,
      newsletterId: 'string',
    };
    sendNotificationMock.mockRejectedValue(Promise.resolve());

    await expect(() =>
      subscriptionProvider.notifyRemoveSubscription(subscription),
    ).not.toThrow();

    expect(sendNotificationMock).toBeCalledTimes(0);
  });
});

class ClientProxyMock extends ClientProxy {
  close(): any {}

  connect(): Promise<any> {
    return Promise.resolve(undefined);
  }

  protected dispatchEvent<T = any>(packet: ReadPacket): Promise<T> {
    return Promise.resolve(undefined);
  }

  protected publish(
    packet: ReadPacket,
    callback: (packet: WritePacket) => void,
  ): Function {
    return undefined;
  }
}
