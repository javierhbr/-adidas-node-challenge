import { ISubscriptionModel } from './subscription-model.interface';

export interface ISubscriptionRepository {
  addSubscription(subs: ISubscriptionModel): Promise<ISubscriptionModel>;
  deleteSubscription(subsId: string): Promise<ISubscriptionModel>;
  getSubscriptionById(subsId: string): Promise<ISubscriptionModel>;
  getAllSubscription(
    page: number,
    pageSize: number,
  ): Promise<ISubscriptionModel[]>;
}
