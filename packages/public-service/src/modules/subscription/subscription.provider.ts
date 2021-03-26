import { HttpService, Injectable, Logger } from '@nestjs/common';
import { SubscriptionDto } from './dto/subscription.dto';
import * as config from 'config';
import { ISubscriptionProvider } from './interface/subscription-provider.interface';
import { HttpError } from '../exceptions/http-error';
import { AxiosResponse } from 'axios';
import { DownstreamErrorException } from '../exceptions/downstream-error.exception';
import { PaginationOptionDto } from './dto/pagination-option.dto';

const subsConfigProp = config.get('subscription_config');

@Injectable()
export class SubscriptionProvider {
  private logger = new Logger(SubscriptionProvider.name);

  private subscriptionConfig: ISubscriptionProvider;

  constructor(private readonly httpService: HttpService) {
    this.setupEndpoints();
  }

  private setupEndpoints() {
    this.subscriptionConfig = {
      serviceUrl: subsConfigProp.service_url,
      addSubsPath: `${subsConfigProp.service_url}/${subsConfigProp.add_subs}`,
      cancelSubsPath: `${subsConfigProp.service_url}/${subsConfigProp.cancel_subs}`,
      detailsSubsPath: `${subsConfigProp.service_url}/${subsConfigProp.details_subs}`,
      allSubsPath: `${subsConfigProp.service_url}/${subsConfigProp.all_subs}`,
    };
  }

  async addNewSubscription(subscription: SubscriptionDto): Promise<any> {
    return new Promise<any>((res, rej) => {
      this.httpService
        .post(this.subscriptionConfig.addSubsPath, subscription)
        .toPromise()
        .then((response) => res(this.handleResponse(response)))
        .catch((e) => {
          rej(this.handleError(e));
        });
    });
  }

  async cancelSubscription(subscriptionId: string) {
    return new Promise<any>((res, rej) => {
      this.httpService
        .delete(`${this.subscriptionConfig.cancelSubsPath}/${subscriptionId}`)
        .toPromise()
        .then((response) => res(this.handleResponse(response)))
        .catch((e) => {
          rej(this.handleError(e));
        });
    });
  }

  async getSubscription(subscriptionId: string) {
    return new Promise<any>((res, rej) => {
      this.httpService
        .get(`${this.subscriptionConfig.detailsSubsPath}/${subscriptionId}`)
        .toPromise()
        .then((response) => res(this.handleResponse(response)))
        .catch((e) => {
          rej(this.handleError(e));
        });
    });
  }

  async allSubscription(paginationOptions: PaginationOptionDto) {
    return new Promise<any>((res, rej) => {
      this.httpService
        .get(
          `${this.subscriptionConfig.allSubsPath}?sizePage=${paginationOptions.sizePage}&page=${paginationOptions.page}`,
        )
        .toPromise()
        .then((response) => res(this.handleResponse(response)))
        .catch((e) => {
          rej(this.handleError(e));
        });
    });
  }

  private handleError(error: any) {
    const { message, response }: any = error;
    if (message && !response) {
      this.logger.error(
        `Error connecting with subscription-service: ${error.stack}`,
      );
      return new DownstreamErrorException(
        'oops, something happen, please try again in a few minutes',
      );
    }
    return new HttpError({ message, response: this.handleResponse(response) });
  }

  private handleResponse({ data, ...rest }: AxiosResponse) {
    return { data, ...rest };
  }
}
