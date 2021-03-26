import { AxiosResponse } from 'axios';

export class HttpError extends Error {
  response: AxiosResponse;
  constructor(error: Partial<HttpError>) {
    super(error.message);
    this.response = error.response;
  }
}
