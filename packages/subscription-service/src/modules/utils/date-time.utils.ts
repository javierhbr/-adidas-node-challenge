import * as moment from 'moment';

export const DATE_FORMAT = 'yyyy-MM-DD HH:mm:ss';
export const DATE_OF_BIRTH_FORMAT = 'yyyy-MM-DD';

export const formatDateToString = (date: Date, format: string): string => {
  return moment(date).format(format);
};

export const parseStringToDate = (stringDate: string, format: string): Date => {
  const date = moment(stringDate, format).toDate();
  if (date) {
    return date;
  } else {
    return null;
  }
};
