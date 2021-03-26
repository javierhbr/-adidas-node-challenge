import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import * as config from 'config';
const mongoProp = config.get('mongo');

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.MONGO_URI || mongoProp.mongoUri,
      retryAttempts: process.env.MONGO_ATTEMPS || mongoProp.retryAttempts,
      retryDelay: process.env.MONGO_DELAY || mongoProp.retryDelay,
      useCreateIndex: true,
    };
  }
}
