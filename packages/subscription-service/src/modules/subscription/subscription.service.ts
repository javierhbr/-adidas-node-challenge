import { Injectable } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import { NotificationProvider } from './notification-provider.service';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { ISubscriptionModel } from '../interface/subscription-model.interface';
import { BadRequestException, ServerErrorException } from '../exceptions';
import { PaginationOptionDto } from './dto/pagination-option.dto';
import { validate, validateOrReject } from 'class-validator';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly notificationProvider: NotificationProvider,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async addNewSubscription(
    subscription: SubscriptionDto,
  ): Promise<SubscriptionDto> {
    if (subscription.email === 'error@gmail.com') {
      throw new ServerErrorException('Error internal subscription service');
    }
    const savedSubs: ISubscriptionModel = await this.subscriptionRepository.addSubscription(
      subscription,
    );
    await this.notificationProvider.notifyNewSubscription(subscription);
    return { id: savedSubs.id, ...subscription } as SubscriptionDto;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const deletedSubs: ISubscriptionModel = await this.subscriptionRepository.deleteSubscription(
      subscriptionId,
    );
    await this.notificationProvider.notifySubscriptionDeletion(
      deletedSubs as SubscriptionDto,
    );
  }

  async subscriptionDetail(subscriptionId: string): Promise<SubscriptionDto> {
    return (await this.subscriptionRepository.getSubscriptionById(
      subscriptionId,
    )) as SubscriptionDto;
  }

  async getAllSubscription(
    pagination: PaginationOptionDto,
  ): Promise<SubscriptionDto[]> {
    return (await this.subscriptionRepository.getAllSubscription(
      pagination,
    )) as SubscriptionDto[];
  }
}
