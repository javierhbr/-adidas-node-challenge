import { SubscriptionProvider } from './subscription.provider';
import { HttpModule, HttpService } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { DownstreamErrorException } from '../exceptions/downstream-error.exception';

jest.mock('axios');

describe('SubscriptionProvider', () => {
  let subscriptionProvider: SubscriptionProvider;

  let httpService: HttpService;
  beforeAll(async () => {
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SubscriptionProvider],
    }).compile();

    subscriptionProvider = mockAppModule.get<SubscriptionProvider>(
      SubscriptionProvider,
    );
    httpService = mockAppModule.get<HttpService>(HttpService);
  });

  beforeEach(async () => {
    subscriptionProvider = new SubscriptionProvider(httpService);
  });

  it('should handler error from Axios', () => {
    expect(subscriptionProvider).toBeDefined();
  });

  describe('addNewSubscription', () => {
    it('should be consume addSubsPath with error', async () => {
      const inputObject = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        isConsent: true,
        newsletterId: 'string',
      };
      const returnMockObject: AxiosResponse<unknown> = {
        data: { id: '6056d31d3a787b2208a8ca66', ...inputObject },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 500,
        statusText: 'ERROR',
      };
      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(returnMockObject));

      const addResponse = await subscriptionProvider.addNewSubscription(
        inputObject,
      );
      expect(addResponse).toBeDefined();
      expect(addResponse.status).toBe(500);
      expect(addResponse.statusText).toBe('ERROR');
    });

    it('should be consume addSubsPath with timeout', async () => {
      const inputObject = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        isConsent: true,
        newsletterId: 'string',
      };
      (axios.get as jest.Mock).mockRejectedValueOnce(() =>
        Promise.reject(new Error('timeout')),
      );

      await expect(
        subscriptionProvider.addNewSubscription(inputObject),
      ).rejects.toThrow(DownstreamErrorException);
    });

    it('should consume addSubsPath with success', async () => {
      const inputObject = {
        email: 'test@gmail.com',
        firstName: 'string',
        dateOfBird: '1983-06-28',
        isConsent: true,
        newsletterId: 'string',
      };
      const returnMockObject: AxiosResponse<unknown> = {
        data: { id: '6056d31d3a787b2208a8ca66', ...inputObject },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(returnMockObject));

      const addResponse = await subscriptionProvider.addNewSubscription(
        inputObject,
      );
      expect(addResponse).toBeDefined();
    });
  });

  describe('cancelSubscription', () => {
    it('should be consume cancelSubscription with error', async () => {
      const subscriptionId: string = 'subscriptionId';
      const returnMockObject: AxiosResponse<unknown> = {
        data: {},
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 500,
        statusText: 'ERROR',
      };
      jest
        .spyOn(httpService, 'delete')
        .mockImplementationOnce(() => of(returnMockObject));

      const addResponse = await subscriptionProvider.cancelSubscription(
        subscriptionId,
      );
      expect(addResponse).toBeDefined();
      expect(addResponse.status).toBe(500);
      expect(addResponse.statusText).toBe('ERROR');
    });

    it('should be consume cancelSubscription with connection Error', async () => {
      const subscriptionId: string = 'subscriptionId';
      (axios.delete as jest.Mock).mockRejectedValueOnce(() =>
        Promise.reject(new Error('timeout')),
      );
      await expect(
        subscriptionProvider.cancelSubscription(subscriptionId),
      ).rejects.toThrow(DownstreamErrorException);
    });

    it('should consume cancelSubscription with success', async () => {
      const subscriptionId: string = 'subscriptionId';

      const returnMockObject: AxiosResponse = {
        data: {},
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };
      jest
        .spyOn(httpService, 'delete')
        .mockImplementationOnce(() => of(returnMockObject));

      const addResponse = await subscriptionProvider.cancelSubscription(
        subscriptionId,
      );
      expect(addResponse).toBeDefined();
    });
  });

  describe('getSubscription', () => {
    it('should be consume getSubscription with error', async () => {
      const subscriptionId: string = 'subscriptionId';
      const returnMockObject: AxiosResponse<unknown> = {
        data: {},
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 500,
        statusText: 'ERROR',
      };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(returnMockObject));

      const addResponse = await subscriptionProvider.getSubscription(
        subscriptionId,
      );
      expect(addResponse).toBeDefined();
      expect(addResponse.status).toBe(500);
      expect(addResponse.statusText).toBe('ERROR');
    });

    it('should be consume getSubscription with connection Error', async () => {
      const subscriptionId: string = 'subscriptionId';
      (axios.get as jest.Mock).mockRejectedValueOnce(() =>
        Promise.reject(new Error('timeout')),
      );
      await expect(
        subscriptionProvider.getSubscription(subscriptionId),
      ).rejects.toThrow(DownstreamErrorException);
    });

    it('should consume getSubscription with success', async () => {
      const subscriptionId: string = 'subscriptionId';
      const subscriptionMock = {
        id: '6058d1ab0c269d840f8cb2aa',
        email: 'test@gmail.com',
        firstName: 'Elvis',
        dateOfBird: '1983-06-28',
        isConsent: true,
        newsletterId: 'newsletterId',
      };

      const returnMockObject: AxiosResponse = {
        data: subscriptionMock,
        headers: {},
        config: { url: 'http://localhost:3000/getSubscription' },
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(returnMockObject));
      // (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve(returnMockObject));

      const addResponse = await subscriptionProvider.getSubscription(
        subscriptionId,
      );
      expect(addResponse).toBeDefined();
      expect(addResponse.data).toStrictEqual(subscriptionMock);
    });
  });

  describe('allSubscription', () => {
    const paginationOps = { sizePage: 10, page: 1 };

    it('should be consume allSubscription with error', async () => {
      const returnMockObject: AxiosResponse<unknown> = {
        data: {},
        headers: {},
        config: { url: 'http://localhost:3000/allSubscription' },
        status: 500,
        statusText: 'ERROR',
      };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(returnMockObject));

      const addResponse = await subscriptionProvider.allSubscription(
        paginationOps,
      );
      expect(addResponse).toBeDefined();
      expect(addResponse.status).toBe(500);
      expect(addResponse.statusText).toBe('ERROR');
    });

    it('should be consume allSubscription with connection Error', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(() =>
        Promise.reject(new Error('timeout')),
      );
      await expect(
        subscriptionProvider.allSubscription(paginationOps),
      ).rejects.toThrow(DownstreamErrorException);
    });

    it('should consume allSubscription with success', async () => {
      const subscriptionMock = [
        {
          id: '6058d1ab0c269d840f8cb2aa',
          email: 'test@gmail.com',
          firstName: 'Elvis',
          dateOfBird: '1983-06-28',
          isConsent: true,
          newsletterId: 'newsletterId',
        },
      ];

      const returnMockObject: AxiosResponse = {
        data: subscriptionMock,
        headers: {},
        config: { url: 'http://localhost:3000/getSubscription' },
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(returnMockObject));
      const addResponse = await subscriptionProvider.allSubscription(
        paginationOps,
      );
      expect(addResponse).toBeDefined();
      expect(addResponse.data).toStrictEqual(subscriptionMock);
    });
  });
});
