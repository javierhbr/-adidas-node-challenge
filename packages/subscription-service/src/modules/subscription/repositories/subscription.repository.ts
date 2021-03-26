import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../interface/subscription-repository.interface';
import { ISubscriptionModel } from '../../interface/subscription-model.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from '../schema/subscription.schema';
import { Model, PaginateModel } from 'mongoose';
import { MongodbErrorException } from '../../exceptions/mongodb-error.exception';

import { NoSubscriptionException } from '../../exceptions';
import {
  DATE_OF_BIRTH_FORMAT,
  formatDateToString,
} from '../../utils/date-time.utils';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Subscription.name)
    private readonly subscriptionPaginateModel: PaginateModel<SubscriptionDocument>,
  ) {}

  async addSubscription(
    subscription: ISubscriptionModel,
  ): Promise<ISubscriptionModel> {
    try {
      const newSubscription = await this.subscriptionModel.create(subscription);
      return { id: newSubscription._id };
    } catch (error) {
      throw new MongodbErrorException('Oops, we got an error', error.stack);
    }
  }

  async deleteSubscription(
    subscriptionId: string,
  ): Promise<ISubscriptionModel> {
    let subscriptionDeleted: SubscriptionDocument;
    try {
      subscriptionDeleted = await this.subscriptionModel.findByIdAndDelete(
        subscriptionId,
      );
    } catch (error) {
      throw new MongodbErrorException(
        `Oops, we got an error deleting subscription ${subscriptionId}`,
        error.stack,
      );
    }
    if (!subscriptionDeleted) {
      throw new NoSubscriptionException(
        `Oops, we couldn't find the subscription to delete ${subscriptionId}`,
      );
    }
    return this.mapFromDocumentToModel(subscriptionDeleted);
  }

  async getSubscriptionById(
    subscriptionId: string,
  ): Promise<ISubscriptionModel> {
    let subscription: SubscriptionDocument;
    try {
      subscription = await this.subscriptionModel.findById(subscriptionId);
    } catch (error) {
      throw new MongodbErrorException(
        `Oops, we got an error finding subscription ${subscriptionId}`,
        error.stack,
      );
    }

    if (!subscription) {
      throw new NoSubscriptionException(
        `Oops, we couldn't find the subscription ${subscriptionId}`,
      );
    }
    return this.mapFromDocumentToModel(subscription);
  }

  async getAllSubscription(pagination: any): Promise<ISubscriptionModel[]> {
    const paginationOptions = {
      page: pagination.page,
      limit: pagination.sizePage,
    };
    let result;
    try {
      result = await this.subscriptionPaginateModel.paginate(
        {},
        paginationOptions,
      );
    } catch (error) {
      throw new MongodbErrorException(
        'Oops, we got an error getting all subscription',
        error.stack,
      );
    }

    if (result.docs.length === 0) {
      throw new NoSubscriptionException(
        `Oops, we couldn't find any subscription`,
      );
    }
    return result.docs.map((subscription) =>
      this.mapFromDocumentToModel(subscription),
    );
  }

  private mapFromDocumentToModel(
    subscription: SubscriptionDocument,
  ): ISubscriptionModel {
    return {
      id: subscription._id,
      email: subscription.email,
      firstName: subscription.firstName,
      gender: subscription.gender,
      dateOfBird: formatDateToString(
        subscription.dateOfBird,
        DATE_OF_BIRTH_FORMAT,
      ),
      isConsent: subscription.isConsent,
      newsletterId: subscription.newsletterId,
    };
  }
}
