import { NotificationService } from './notification.service';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { ServerErrorException } from '../exceptions';
import { IMessage } from '../interface/notification.interface';
import { NotificationTypeEnum } from '../common/notification-type.enum';

describe('MessageService', () => {
  let notificationService: NotificationService;
  const pattern: string = 'pattern';
  const message: IMessage = {
    notificationType: NotificationTypeEnum.EMAIL,
    destination: 'test@email.com',
    message: 'Testing MEssage',
  };

  let emitMock = jest.fn();
  class ClientProxyMock extends ClientProxy {
    emit = () => emitMock();

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

  beforeEach(async () => {
    emitMock = jest.fn(() => of());
    notificationService = new NotificationService(new ClientProxyMock());
  });

  afterEach(() => jest.clearAllMocks());

  describe('addNewSubscription', () => {
    it('should handler error on by user addNewSubscription', async () => {
      emitMock = jest.fn(() =>
        throwError(new ServerErrorException('java hater')),
      );
      await expect(
        notificationService.sendNotification(pattern, message),
      ).rejects.toThrow(ServerErrorException);
    });

    it('should send notification', async () => {
      await notificationService.sendNotification(pattern, message);
      expect(emitMock).toBeCalled();
    });
  });
});
