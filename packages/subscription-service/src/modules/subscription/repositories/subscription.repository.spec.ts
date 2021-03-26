import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionRepository } from './subscription.repository';
import { getModelToken } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from '../schema/subscription.schema';
import { GenderEnum } from '../../../../../public-service/src/modules/common/gender.enum';
import { ISubscriptionModel } from '../../interface/subscription-model.interface';
import { MongodbErrorException } from '../../exceptions/mongodb-error.exception';
import { Model, PaginateOptions, PaginateResult } from 'mongoose';
import { NoSubscriptionException } from '../../exceptions';

describe('SubscriptionRepository', () => {
  let subscriptionRepository: SubscriptionRepository;
  let subscriptionModel: Model<SubscriptionDocument>;

  let createMock = jest.fn();
  let findByIdAndDeleteMock = jest.fn();
  let findByIdMock = jest.fn();
  let paginateMock = jest.fn();

  class SubscriptionModelMock {
    create = () => createMock();
    findById = () => findByIdMock();
    findByIdAndDelete = () => findByIdAndDeleteMock();
    paginate = (query?: any, options?: any, callback?: any) => paginateMock();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionRepository,
        {
          provide: getModelToken(Subscription.name),
          useValue: new SubscriptionModelMock(),
        },
        {
          provide: getModelToken(Subscription.name),
          useValue: new SubscriptionModelMock(),
        },
      ],
    }).compile();
    subscriptionRepository = module.get<SubscriptionRepository>(
      SubscriptionRepository,
    );
    subscriptionModel = module.get<Model<SubscriptionDocument>>(
      getModelToken(Subscription.name),
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('addSubscription', () => {
    const newSubscription: ISubscriptionModel = {
      email: 'test@gmail.com',
      firstName: 'string',
      dateOfBird: '1983-06-28',
      gender: GenderEnum.NON_INDICATED,
      isConsent: true,
      newsletterId: 'string',
    };

    it('should handler error on addSubscription', async () => {
      createMock.mockRejectedValueOnce(new Error('addNewSubscription-Error'));
      await expect(
        subscriptionRepository.addSubscription(newSubscription),
      ).rejects.toThrow(MongodbErrorException);
      expect(createMock).toBeCalled();
    });

    /**
     * Error del mock
     */
    it('should  return subscription with id', async () => {
      const mockedSubscription = {
        _id: 'mockedId',
        email: 'saved@subscription.com',
        firstName: 'string',
        dateOfBird: new Date(),
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };
      createMock.mockResolvedValueOnce(mockedSubscription);
      const savedSubscription: ISubscriptionModel = await subscriptionRepository.addSubscription(
        newSubscription,
      );

      expect(savedSubscription).toBeDefined();
      expect(savedSubscription.id).toBe('mockedId');
      expect(createMock).toBeCalled();
    });
  });

  describe('deleteSubscription', () => {
    const subscriptionIdToRemove: string = 'MOCK_ID';
    it('should handler error on deleteSubscription - MongodbErrorException', async () => {
      findByIdAndDeleteMock.mockRejectedValueOnce(
        new Error('deleteSubscription-Error'),
      );
      await expect(
        subscriptionRepository.deleteSubscription(subscriptionIdToRemove),
      ).rejects.toThrow(MongodbErrorException);
      expect(findByIdAndDeleteMock).toBeCalledTimes(1);
    });

    it('should handler error on deleteSubscription - NoSubscriptionException', async () => {
      findByIdAndDeleteMock.mockResolvedValueOnce(undefined);

      await expect(
        subscriptionRepository.deleteSubscription(subscriptionIdToRemove),
      ).rejects.toThrow(NoSubscriptionException);
      expect(findByIdAndDeleteMock).toBeCalledTimes(1);
    });

    it('should  remove subscription with id', async () => {
      const subscriptionToDelete: ISubscriptionModel = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };
      findByIdAndDeleteMock.mockResolvedValueOnce(subscriptionToDelete);

      const subscriptionDeleted: ISubscriptionModel = await subscriptionRepository.deleteSubscription(
        subscriptionIdToRemove,
      );
      expect(subscriptionDeleted).toStrictEqual({
        dateOfBird: '1983-06-28',
        email: 'test@gmail.com',
        firstName: 'string',
        gender: 'NON_INDICATED',
        id: undefined,
        isConsent: true,
        newsletterId: 'string',
      });
      expect(findByIdAndDeleteMock).toBeCalledTimes(1);
    });
  });

  describe('getSubscriptionById', () => {
    const subscriptionIdToRemove: string = 'MOCK_ID';
    it('should handler error on getSubscriptionById - MongodbErrorException', async () => {
      findByIdMock.mockRejectedValueOnce(
        new Error('getSubscriptionById-Error'),
      );
      await expect(
        subscriptionRepository.getSubscriptionById(subscriptionIdToRemove),
      ).rejects.toThrow(MongodbErrorException);
      expect(findByIdMock).toBeCalledTimes(1);
    });

    it('should handler error on getSubscriptionById - NoSubscriptionException', async () => {
      findByIdMock.mockResolvedValueOnce(undefined);
      await expect(
        subscriptionRepository.getSubscriptionById(subscriptionIdToRemove),
      ).rejects.toThrow(NoSubscriptionException);
      expect(findByIdMock).toBeCalledTimes(1);
    });

    it('should  getting subscription detail with id', async () => {
      const subscriptionToDelete: ISubscriptionModel = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };
      findByIdMock.mockResolvedValueOnce(subscriptionToDelete);

      const subscriptionDeleted: ISubscriptionModel = await subscriptionRepository.getSubscriptionById(
        subscriptionIdToRemove,
      );
      expect(subscriptionDeleted).toStrictEqual({
        dateOfBird: '1983-06-28',
        email: 'test@gmail.com',
        firstName: 'string',
        gender: 'NON_INDICATED',
        id: undefined,
        isConsent: true,
        newsletterId: 'string',
      });
      expect(findByIdMock).toBeCalledTimes(1);
    });
  });

  describe('getAllSubscription', () => {
    const subscriptionIdToRemove: string = 'MOCK_ID';
    it('should handler error on getAllSubscription - MongodbErrorException', async () => {
      paginateMock.mockRejectedValueOnce(new Error('getAllSubscription-Error'));
      await expect(
        subscriptionRepository.getAllSubscription(subscriptionIdToRemove),
      ).rejects.toThrow(MongodbErrorException);
      expect(paginateMock).toBeCalledTimes(1);
    });

    it('should handler error on getAllSubscription - NoSubscriptionException', async () => {
      const docs: any[] = [];
      paginateMock.mockResolvedValueOnce({ docs: [] });
      await expect(
        subscriptionRepository.getAllSubscription(subscriptionIdToRemove),
      ).rejects.toThrow(NoSubscriptionException);
      expect(paginateMock).toBeCalledTimes(1);
    });

    it('should  getting All subscription', async () => {
      const subscriptionToDelete: ISubscriptionModel = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };
      paginateMock.mockResolvedValueOnce({
        docs: [subscriptionToDelete, subscriptionToDelete],
      });

      const result: ISubscriptionModel[] = await subscriptionRepository.getAllSubscription(
        subscriptionIdToRemove,
      );
      expect(paginateMock).toBeCalledTimes(1);
    });
  });
});
