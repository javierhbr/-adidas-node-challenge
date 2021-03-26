import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { HttpModule } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import { GenderEnum } from '../common/gender.enum';
import { MongodbErrorException } from '../exceptions/mongodb-error.exception';
import { NoSubscriptionException, ServerErrorException } from '../exceptions';
import { ISubscriptionModel } from '../interface/subscription-model.interface';
import 'jest-extended';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  const baseNewSubscription: SubscriptionDto = {
    email: 'test@gmail.com',
    firstName: 'string',
    dateOfBird: '1983-06-28',
    gender: GenderEnum.NON_INDICATED,
    isConsent: true,
    newsletterId: 'string',
  };

  class NotificationProvider {
    static notifyNewSubscription = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve());
    static notifySubscriptionDeletion = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve());
  }

  const addSubscriptionRepoMock = jest.fn();
  const getSubscriptionByIdRepoMock = jest.fn();
  const getAllSubscriptionRepoMock = jest.fn();
  const deleteSubscriptionRepoMock = jest.fn();
  /* tslint:disable:max-classes-per-file */
  class SubscriptionRepository {
    static addSubscription = addSubscriptionRepoMock;
    static getSubscriptionById = getSubscriptionByIdRepoMock;
    static getAllSubscription = getAllSubscriptionRepoMock;
    static deleteSubscription = deleteSubscriptionRepoMock;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: NotificationProvider.name,
          useValue: NotificationProvider,
        },
        {
          provide: SubscriptionRepository.name,
          useValue: SubscriptionRepository,
        },
      ],
      imports: [HttpModule],
    }).compile();

    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(subscriptionService).toBeDefined();
  });

  describe('addNewSubscription', () => {
    it('should return saved Subscription', async () => {
      const inputObject: SubscriptionDto = baseNewSubscription;
      const addedSubscriptionMock: ISubscriptionModel = baseNewSubscription;
      addedSubscriptionMock.id = 'subscriptionMockID';
      addSubscriptionRepoMock.mockResolvedValueOnce(addedSubscriptionMock);

      const subscriptionDetail = await subscriptionService.addNewSubscription(
        inputObject,
      );
      expect(inputObject).toBeDefined();
      expect(subscriptionDetail).toBeDefined();
      expect(subscriptionDetail).toStrictEqual(addedSubscriptionMock);
      expect(SubscriptionRepository.addSubscription).toBeCalled();
      expect(NotificationProvider.notifyNewSubscription).toBeCalled();
    });

    it('should handler error on by user addNewSubscription', async () => {
      const inputObject: SubscriptionDto = baseNewSubscription;
      inputObject.email = 'error@gmail.com';
      baseNewSubscription.id = 'newSubscriptionMockID';

      addSubscriptionRepoMock.mockRejectedValueOnce(() =>
        Promise.reject(new Error('addNewSubscription-Error')),
      );
      await expect(
        subscriptionService.addNewSubscription(inputObject),
      ).rejects.toThrow(ServerErrorException);
    });

    it('should handler error on addNewSubscription', async () => {
      const inputObject: SubscriptionDto = baseNewSubscription;
      inputObject.email = 'error@gmail.com';
      baseNewSubscription.id = 'newSubscriptionMockID';

      addSubscriptionRepoMock.mockRejectedValueOnce(() =>
        Promise.reject(new MongodbErrorException('Oops, we got an error', {})),
      );
      await expect(
        subscriptionService.addNewSubscription(inputObject),
      ).rejects.toThrow(ServerErrorException);
    });
  });

  describe('subscriptionDetail', () => {
    const commonSubscriptionId: string = 'mockSubscriptionId';

    it('should handle MongodbErrorException', async () => {
      jest
        .spyOn(SubscriptionRepository, 'getSubscriptionById')
        .mockRejectedValueOnce(new MongodbErrorException('Mongo error', {}));
      await expect(
        subscriptionService.subscriptionDetail(commonSubscriptionId),
      ).rejects.toThrow(MongodbErrorException);
      expect(SubscriptionRepository.getSubscriptionById).toBeCalled();
    });

    it('should handle MongodbErrorException', async () => {
      jest
        .spyOn(SubscriptionRepository, 'getSubscriptionById')
        .mockRejectedValueOnce(
          new NoSubscriptionException(
            `Oops, we couldn't find the subscription`,
          ),
        );
      await expect(
        subscriptionService.subscriptionDetail(commonSubscriptionId),
      ).rejects.toThrow(NoSubscriptionException);
      expect(SubscriptionRepository.getSubscriptionById).toBeCalled();
    });

    it('should return details from getSubscription', async () => {
      const detailSubscriptionMock: ISubscriptionModel = baseNewSubscription;
      detailSubscriptionMock.id = 'subscriptionMockID';
      jest
        .spyOn(SubscriptionRepository, 'getSubscriptionById')
        .mockResolvedValueOnce(detailSubscriptionMock);

      const subscriptionDetail = await subscriptionService.subscriptionDetail(
        commonSubscriptionId,
      );
      expect(subscriptionDetail).toBeDefined();
      expect(subscriptionDetail).toStrictEqual(detailSubscriptionMock);
      expect(SubscriptionRepository.getSubscriptionById).toBeCalled();
    });
  });

  describe('getAllSubscription', () => {
    const paginationRequest: {
      sizePage: number;
      page: number;
    } = { sizePage: 10, page: 1 };

    it('should handle MongodbErrorException', async () => {
      jest
        .spyOn(SubscriptionRepository, 'getAllSubscription')
        .mockRejectedValueOnce(new MongodbErrorException('Mongo error', {}));
      await expect(
        subscriptionService.getAllSubscription(paginationRequest),
      ).rejects.toThrow(MongodbErrorException);
      expect(SubscriptionRepository.getAllSubscription).toBeCalled();
    });

    it('should handle MongodbErrorException', async () => {
      jest
        .spyOn(SubscriptionRepository, 'getAllSubscription')
        .mockRejectedValueOnce(
          new NoSubscriptionException(
            `Oops, we couldn't find the subscription`,
          ),
        );
      await expect(
        subscriptionService.getAllSubscription(paginationRequest),
      ).rejects.toThrow(NoSubscriptionException);
      expect(SubscriptionRepository.getAllSubscription).toBeCalled();
    });

    it('should return list of Subscription', async () => {
      const detailSubscriptionMock: ISubscriptionModel = baseNewSubscription;
      detailSubscriptionMock.id = 'subscriptionMockID';
      jest
        .spyOn(SubscriptionRepository, 'getAllSubscription')
        .mockResolvedValueOnce([
          detailSubscriptionMock,
          detailSubscriptionMock,
        ]);

      const subscriptions = await subscriptionService.getAllSubscription(
        paginationRequest,
      );
      expect(subscriptions).toBeDefined();
      expect(SubscriptionRepository.getAllSubscription).toBeCalledWith(
        paginationRequest,
      );
      expect(subscriptions).toBeArrayOfSize(2);
      expect(subscriptions).toIncludeSameMembers([
        detailSubscriptionMock,
        detailSubscriptionMock,
      ]);
    });
  });

  describe('cancelSubscription', () => {
    const commonSubscriptionId: string = 'mockSubscriptionId';

    it('should handle MongodbErrorException', async () => {
      jest
        .spyOn(SubscriptionRepository, 'deleteSubscription')
        .mockRejectedValueOnce(new MongodbErrorException('Mongo error', {}));
      await expect(
        subscriptionService.cancelSubscription(commonSubscriptionId),
      ).rejects.toThrow(MongodbErrorException);
      expect(SubscriptionRepository.deleteSubscription).toBeCalled();
    });

    it('should handle MongodbErrorException', async () => {
      jest
        .spyOn(SubscriptionRepository, 'deleteSubscription')
        .mockRejectedValueOnce(
          new NoSubscriptionException(
            `Oops, we couldn't find the subscription`,
          ),
        );
      await expect(
        subscriptionService.cancelSubscription(commonSubscriptionId),
      ).rejects.toThrow(NoSubscriptionException);
      expect(SubscriptionRepository.deleteSubscription).toBeCalled();
    });

    it('should return removed subscription', async () => {
      const detailSubscriptionMock: ISubscriptionModel = baseNewSubscription;
      detailSubscriptionMock.id = 'subscriptionMockID';
      jest
        .spyOn(SubscriptionRepository, 'deleteSubscription')
        .mockResolvedValueOnce(detailSubscriptionMock);

      await subscriptionService.cancelSubscription(commonSubscriptionId);
      expect(SubscriptionRepository.deleteSubscription).toBeCalledWith(
        commonSubscriptionId,
      );
      expect(NotificationProvider.notifySubscriptionDeletion).toBeCalledWith(
        detailSubscriptionMock,
      );
    });
  });
});
