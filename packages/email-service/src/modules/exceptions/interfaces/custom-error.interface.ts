export interface CustomError {
  code: string;
  message: string;
  dateTime?: string;
  details?: string | string[];
  data?: any;
}
