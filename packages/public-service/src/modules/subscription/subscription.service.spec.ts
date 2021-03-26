import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { HttpModule } from '@nestjs/common';
import { SubscriptionProvider } from './subscription.provider';
import { SubscriptionDto } from './dto/subscription.dto';
import { GenderEnum } from '../common/gender.enum';
import { DownstreamErrorException } from '../exceptions/downstream-error.exception';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  let subscriptionProvider: SubscriptionProvider;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionService, SubscriptionProvider],
      imports: [HttpModule],
    }).compile();

    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    subscriptionProvider = module.get<SubscriptionProvider>(
      SubscriptionProvider,
    );
  });

  it('should be defined', () => {
    expect(subscriptionService).toBeDefined();
    expect(subscriptionProvider).toBeDefined();
  });

  describe('addNewSubscription', () => {
    const baseNewSubscription = {
      email: 'test@gmail.com',
      firstName: 'string',
      dateOfBird: '1983-06-28',
      gender: GenderEnum.NON_INDICATED,
      isConsent: true,
      newsletterId: 'string',
    };

    it('should handler error on addNewSubscription', async () => {
      const inputObject: SubscriptionDto = baseNewSubscription;
      jest
        .spyOn(subscriptionProvider, 'addNewSubscription')
        .mockRejectedValueOnce(() =>
          Promise.reject(new Error('addNewSubscription-Error')),
        );
      await expect(
        subscriptionService.addNewSubscription(inputObject),
      ).rejects.toThrow(DownstreamErrorException);
      expect(subscriptionProvider.addNewSubscription).toBeCalled();
    });

    it('should process addNewSubscription', async () => {
      const inputObject: SubscriptionDto = baseNewSubscription;
      const addedSubscriptionMock: SubscriptionDto = baseNewSubscription;
      addedSubscriptionMock.id = 'newSubscriptionMockID';

      jest
        .spyOn(subscriptionProvider, 'addNewSubscription')
        // .mockImplementationOnce(() => Promise.resolve(addedSubscriptionMock));
        .mockResolvedValueOnce({ data: addedSubscriptionMock });

      const newSubsResponse = await subscriptionService.addNewSubscription(
        inputObject,
      );
      expect(newSubsResponse).toBeDefined();
      expect(newSubsResponse).toStrictEqual(addedSubscriptionMock);
      expect(subscriptionProvider.addNewSubscription).toBeCalled();
    });
  });

  describe('subscriptionDetail', () => {
    const commonSubscriptionId: string = 'mockSubscriptionId';

    it('should handler error on getSubscription', async () => {
      jest
        .spyOn(subscriptionProvider, 'getSubscription')
        .mockRejectedValueOnce(() =>
          Promise.reject(new Error('addNewSubscription-Error')),
        );
      await expect(
        subscriptionService.subscriptionDetail(commonSubscriptionId),
      ).rejects.toThrow(DownstreamErrorException);
      expect(subscriptionProvider.getSubscription).toBeCalled();
    });

    it('should return details from getSubscription', async () => {
      const detailSubscriptionMock = {
        id: commonSubscriptionId,
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };
      jest
        .spyOn(SubscriptionProvider.prototype, 'getSubscription')
        .mockResolvedValueOnce({ data: detailSubscriptionMock });

      const subscriptionDetail = await subscriptionService.subscriptionDetail(
        commonSubscriptionId,
      );
      expect(subscriptionDetail).toBeDefined();
      expect(subscriptionDetail).toStrictEqual(detailSubscriptionMock);
      expect(subscriptionProvider.getSubscription).toBeCalled();
    });
  });

  describe('cancelSubscription', () => {
    const commonSubscriptionId: string = 'mockSubscriptionId';

    it('should handler error on cancelSubscription', async () => {
      jest
        .spyOn(subscriptionProvider, 'cancelSubscription')
        .mockRejectedValueOnce(() =>
          Promise.reject(new Error('cancelSubscription-Error')),
        );
      await expect(
        subscriptionService.subscriptionDetail(commonSubscriptionId),
      ).rejects.toThrow(DownstreamErrorException);
      expect(subscriptionProvider.getSubscription).toBeCalled();
    });

    it('should return details from cancelSubscription', async () => {
      const detailSubscriptionMock = {
        id: commonSubscriptionId,
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };
      jest
        .spyOn(SubscriptionProvider.prototype, 'cancelSubscription')
        .mockResolvedValueOnce({ data: detailSubscriptionMock });

      const subscriptionDetail = await subscriptionService.cancelSubscription(
        commonSubscriptionId,
      );
      expect(subscriptionDetail).toBeDefined();
      expect(subscriptionDetail).toStrictEqual(detailSubscriptionMock);
      expect(subscriptionProvider.cancelSubscription).toBeCalled();
    });
  });

  describe('getAllSubscription', () => {
    const paginationOps = { sizePage: 10, page: 1 };
    it('should handler error on getAllSubscription', async () => {
      jest
        .spyOn(subscriptionProvider, 'allSubscription')
        .mockRejectedValueOnce(() =>
          Promise.reject(new Error('subscriptionDetail-Error')),
        );
      await expect(
        subscriptionService.getAllSubscription(paginationOps),
      ).rejects.toThrow(DownstreamErrorException);
      expect(subscriptionProvider.getSubscription).toBeCalled();
    });

    it('should return details from getAllSubscription', async () => {
      const allSubscriptionMockResult = [
        {
          id: 'subscriptionId',
          email: 'test@gmail.com',
          firstName: 'string',
          dateOfBird: '1983-06-28',
          gender: GenderEnum.NON_INDICATED,
          isConsent: true,
          newsletterId: 'string',
        },
      ];
      jest
        .spyOn(subscriptionProvider, 'allSubscription')
        .mockResolvedValueOnce({ data: allSubscriptionMockResult });

      const subscriptionDetail = await subscriptionService.getAllSubscription(
        paginationOps,
      );
      expect(subscriptionDetail).toBeDefined();
      expect(subscriptionProvider.allSubscription).toBeCalledWith(
        paginationOps,
      );
    });
  });
});
