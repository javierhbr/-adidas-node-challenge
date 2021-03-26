import { Injectable } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import { SubscriptionProvider } from './subscription.provider';
import { DownstreamErrorException } from '../exceptions/downstream-error.exception';
import { NoSubscriptionException } from '../exceptions/no-subscription.exception';
import { PaginationOptionDto } from './dto/pagination-option.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptionProvider: SubscriptionProvider) {}

  async addNewSubscription(
    subscription: SubscriptionDto,
  ): Promise<SubscriptionDto> {
    try {
      const response: any = await this.subscriptionProvider.addNewSubscription(
        subscription,
      );
      return response.data;
    } catch (error) {
      throw new DownstreamErrorException(error.stack);
    }
  }

  async subscriptionDetail(subscriptionId: string): Promise<SubscriptionDto> {
    try {
      const response: any = await this.subscriptionProvider.getSubscription(
        subscriptionId,
      );
      return response.data;
    } catch (error) {
      this.handler404Error(error);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<SubscriptionDto> {
    try {
      const response: any = await this.subscriptionProvider.cancelSubscription(
        subscriptionId,
      );
      return response.data;
    } catch (error) {
      throw new DownstreamErrorException(error.stack);
    }
  }

  async getAllSubscription(
    paginationOptions: PaginationOptionDto,
  ): Promise<SubscriptionDto[]> {
    try {
      const response: any = await this.subscriptionProvider.allSubscription(
        paginationOptions,
      );
      return response.data;
    } catch (error) {
      this.handler404Error(error);
    }
  }

  private handler404Error(error: any) {
    if (error.response?.status === 404) {
      throw new NoSubscriptionException(
        error.response.data.error.code,
        error.response.data.error.message,
      );
    }
    throw new DownstreamErrorException(error.stack);
  }
}
