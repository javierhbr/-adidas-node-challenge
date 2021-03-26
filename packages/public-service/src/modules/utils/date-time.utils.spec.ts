import {
  DATE_FORMAT,
  formatDateToString,
  parseStringToDate,
} from './date-time.utils';

describe('date-time.utils', () => {
  describe('formatDateToString', () => {
    it('should return string date from obj', () => {
      const dateToParse: Date = new Date('01/01/1970 11:40:0:0');
      const stringDate = formatDateToString(dateToParse, DATE_FORMAT);
      expect(stringDate).toBeDefined();
      expect(stringDate).toBe('1970-01-01 11:40:00');
    });

    it('should return string date from undefined', () => {
      const dateToParse: Date = null;
      const stringDate = formatDateToString(dateToParse, DATE_FORMAT);
      expect(stringDate).toBeDefined();
      expect(stringDate).toBe('Invalid date');
    });
  });

  describe('parseStringToDate', () => {
    it('should return Date date from string', () => {
      const stringDate: string = '1970-01-01 11:40:0:0';
      const finalDate = parseStringToDate(stringDate, DATE_FORMAT);
      expect(finalDate).toBeDefined();
      expect(finalDate.toString()).toBe(
        new Date('01/01/1970 11:40:0:0').toString(),
      );
    });

    it('should return Date date from obj', () => {
      const stringDate: string = '1970/01/01 11:40:0:0';
      const finalDate = parseStringToDate(stringDate, DATE_FORMAT);
      expect(finalDate).toBeDefined();
      expect(finalDate.toISOString()).toBe('1970-01-01T17:40:00.000Z');
    });
  });
});
