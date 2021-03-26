import {
  HttpModule as BaseHttpModule,
  HttpService,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';

@Module({
  imports: [BaseHttpModule],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  public onModuleInit(): any {
    const metadataKey: string = 'metadata';
    const logger = new Logger('Axios');
    const axios = this.httpService.axiosRef;
    axios.interceptors.request.use((config) => {
      config[metadataKey] = { ...config[metadataKey], startDate: new Date() };
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        const { config } = response;
        config[metadataKey] = { ...config[metadataKey], endDate: new Date() };
        const duration =
          config[metadataKey].endDate.getTime() -
          config[metadataKey].startDate.getTime();
        logger.log(
          `${config.method.toUpperCase()} ${config.url} ${duration}ms`,
        );
        return response;
      },
      (err) => {
        logger.error(err);
        return Promise.reject(err);
      },
    );
  }
}
