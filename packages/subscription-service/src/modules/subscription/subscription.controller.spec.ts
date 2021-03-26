import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionDto } from './dto/subscription.dto';
import { GenderEnum } from '../common/gender.enum';
import 'jest-extended';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;

  const mockSubscriptionDto: SubscriptionDto = {
    id: '6058d1ab0c269d840f8cb2aa',
    email: 'test@gmail.com',
    firstName: 'Elvis',
    dateOfBird: '1983-06-28',
    isConsent: true,
    newsletterId: 'newsletterId',
  };

  class SubscriptionService {
    static addNewSubscription = jest
      .fn()
      .mockResolvedValueOnce(mockSubscriptionDto);
    static subscriptionDetail = jest
      .fn()
      .mockResolvedValue(mockSubscriptionDto);
    static cancelSubscription = jest
      .fn()
      .mockResolvedValue(mockSubscriptionDto);
    static getAllSubscription = jest
      .fn()
      .mockResolvedValue([mockSubscriptionDto, mockSubscriptionDto]);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriptionService.name,
          useValue: SubscriptionService,
        },
      ],
      controllers: [SubscriptionController],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should register new subscription', async () => {
      const subscriptionRequest = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        gender: GenderEnum.NON_INDICATED,
        isConsent: true,
        newsletterId: 'string',
      };

      const response = await controller.createSubscription(subscriptionRequest);
      expect(response).toBeDefined();
      expect(response).toStrictEqual(mockSubscriptionDto);
      expect(SubscriptionService.addNewSubscription).toBeCalledWith(
        subscriptionRequest,
      );
      expect(SubscriptionService.addNewSubscription).toBeCalledTimes(1);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel Subscription', async () => {
      const subscriptionId: string = '6058d1ab0c269d840f8cb2aa';
      const response = await controller.cancelSubscription(subscriptionId);
      expect(response).toBeDefined();
      expect(response).toStrictEqual(mockSubscriptionDto);
      expect(SubscriptionService.cancelSubscription).toBeCalledWith(
        subscriptionId,
      );
      expect(SubscriptionService.cancelSubscription).toBeCalledTimes(1);
    });
  });

  describe('subscriptionDetail', () => {
    it('should return subscription Detail', async () => {
      const subscriptionId: string = '6058d1ab0c269d840f8cb2aa';
      const response = await controller.subscriptionDetail(subscriptionId);
      expect(response).toBeDefined();
      expect(response).toStrictEqual(mockSubscriptionDto);
    });
  });

  describe('getAllSubscription', () => {
    it('should return All Subscription', async () => {
      const paginationOption: { sizePage: number; page: number } = {
        sizePage: 10,
        page: 1,
      };
      const response = await controller.getAllSubscription(
        paginationOption.sizePage,
        paginationOption.page,
      );
      expect(response).toBeDefined();
      expect(response).toBeArrayOfSize(2);
      expect(response).toIncludeSameMembers([
        mockSubscriptionDto,
        mockSubscriptionDto,
      ]);
    });
  });
});
