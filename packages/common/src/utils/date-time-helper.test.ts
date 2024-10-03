// Copyright 2018 Prescryptive Health, Inc.

import { IHour, IHours } from '../models/date-time/hours';
import { ITimeRange } from '../models/date-time/time-range';
import {
  calculateMemberAge,
  differenceInYear,
  UTCDate,
  UTCDateString,
  CalculateAbsoluteAge,
  dateFromHour,
  timeRangeFromHours,
  dateFromISOString,
} from './date-time-helper';

describe('differenceInYear', () => {
  it('Should return proper difference in year', () => {
    const diffInYear = differenceInYear(
      UTCDate(new Date('2019-09-30')),
      UTCDate(new Date('1990-01-01'))
    );
    expect(diffInYear).toBe(29);
  });
});

describe('calculateMemberAge', () => {
  it('should calculate member age', () => {
    const memberAge = calculateMemberAge('2005-01-01', new Date('2020-02-05'));
    expect(memberAge).toBe(15);
  });
});

describe('UTCDate', () => {
  it('should return UTC date', () => {
    expect(UTCDate(new Date('2019-09-30'))).toBe(1569801600);
  });
});

describe('UTCDateString', () => {
  it('should return UTC date in string format', () => {
    expect(
      UTCDateString('Sun Dec 24 2006 16:00:00 GMT-0800 (Pacific Standard Time)')
    ).toBe('2006-12-25');
  });
  it('should return UTC date in string format', () => {
    expect(
      UTCDateString('Sun Dec 31 2006 16:00:00 GMT-0800 (Pacific Standard Time)')
    ).toBe('2007-01-01');
  });
  it('should return UTC date in string format', () => {
    expect(UTCDateString('September-12-2016')).toBe('2016-09-12');
  });
});

describe('CalculateAbsoluteAge', () => {
  it('should calculate age with refernce to current date and returns the age', () => {
    expect(
      CalculateAbsoluteAge(
        new Date('Mon Oct 19 2020 14:03:02 GMT-0700 (Pacific Daylight Time)'),
        'Thu Oct 20 2002 17:00:00 GMT-0700 (Pacific Daylight Time)'
      )
    ).toStrictEqual(17);
  });
  it('should calculate age with reference to given date and time and returns the age ', () => {
    expect(
      CalculateAbsoluteAge(
        new Date('Mon Oct 20 2020 18:03:02 GMT-0700 (Pacific Daylight Time)'),
        'Thu Oct 20 2002 17:00:00 GMT-0700 (Pacific Daylight Time)'
      )
    ).toStrictEqual(18);
  });
});

describe('dateFromHour', () => {
  it.each([
    [{}, new Date(2021, 4, 19, 16, 25), undefined],
    [{ m: 12 }, new Date(2021, 4, 19, 16, 25), undefined],
    [{ h: 0 }, new Date(2021, 4, 19, 16, 25), new Date(2021, 4, 19, 0, 0)],
    [
      { h: 0, m: 12, pm: false },
      new Date(2021, 4, 19, 16, 25),
      new Date(2021, 4, 19, 0, 12),
    ],
    [
      { h: 0, m: 12, pm: true },
      new Date(2021, 4, 19, 16, 25),
      new Date(2021, 4, 19, 12, 12),
    ],
  ])(
    'gets date from %p',
    (hourMock: IHour, nowMock: Date, expectedDate: Date | undefined) => {
      expect(dateFromHour(hourMock, nowMock)).toEqual(expectedDate);
    }
  );
});

describe('timeRangeFromHours', () => {
  it.each([
    [undefined, undefined, new Date(2021, 4, 19, 16, 25), undefined],
    [undefined, { h: 0 }, new Date(2021, 4, 19, 16, 25), undefined],
    [{ h: 0 }, undefined, new Date(2021, 4, 19, 16, 25), undefined],
    [
      { h: 0 },
      { h: 0, m: 1, pm: true },
      new Date(2021, 4, 19, 16, 25),
      { start: new Date(2021, 4, 19, 0, 0), end: new Date(2021, 4, 19, 12, 1) },
    ],
    [
      { h: 0, m: 59 },
      { h: 11, m: 30, pm: true },
      new Date(2021, 4, 19, 16, 25),
      {
        start: new Date(2021, 4, 19, 0, 59),
        end: new Date(2021, 4, 19, 23, 30),
      },
    ],
  ])(
    'gets time range from hours (opens: %p, closes: %p)',
    (
      opensMock: IHour | undefined,
      closesMock: IHour | undefined,
      nowMock: Date,
      expectedTimeRange: ITimeRange | undefined
    ) => {
      const hoursMock: IHours = {
        opens: opensMock,
        closes: closesMock,
        day: '',
      };
      expect(timeRangeFromHours(hoursMock, nowMock)).toEqual(expectedTimeRange);
    }
  );
});

describe('dateFromISOString', () => {
  it.each([
    [undefined, undefined],
    ['', undefined],
    ['2021', undefined],
    ['2021-12', undefined],
    ['2021-12-00', undefined],
    ['2021-12-32', undefined],
    ['yyyy-mm-dd', undefined],
    ['2021-12-31', new Date(2021, 11, 31)],
  ])(
    'converts ISO string %p to Date',
    (isoString: string | undefined, expectedDate: Date | undefined) => {
      expect(dateFromISOString(isoString)).toEqual(expectedDate);
    }
  );
});
