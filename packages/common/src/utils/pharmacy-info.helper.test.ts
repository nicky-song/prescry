// Copyright 2018 Prescryptive Health, Inc.

import { IHours } from '../models/date-time/hours';
import { buildDispenseType, isOpenNow } from './pharmacy-info.helper';
import { convertHoursToMap } from './pharmacy-info.helper';

const mockPharmacies: IHours[] = [
  {
    closes: { h: 9, m: 15, pm: true },
    day: 'Mon',
    opens: { h: 9, m: 10, pm: false },
  },
  {
    closes: { h: 8, m: 0, pm: false },
    day: 'Tue',
    opens: { h: 9, m: 0, pm: false },
  },
  {
    closes: { h: 9, m: 0, pm: true },
    day: 'wed',
    opens: { h: 9, m: 0, pm: true },
  },
  {
    closes: { h: 9, m: 0, pm: true },
    day: 'thu',
    opens: { h: 9, m: 0, pm: false },
  },
  {
    closes: { h: 9, m: 0, pm: true },
    day: 'fri',
    opens: { h: 9, m: 0, pm: false },
  },
  {
    closes: { h: 6, m: 0, pm: true },
    day: 'sat',
    opens: { h: 9, m: 0, pm: false },
  },
  {
    day: 'sun',
  },
];

describe('isOpenNow', () => {
  it('should return boolean value true when current time is in between open and close timing of pharmacy store ', () => {
    expect(isOpenNow(mockPharmacies, new Date(2019, 2, 1, 9, 15))).toBeTruthy();
    expect(isOpenNow(mockPharmacies, new Date(2019, 2, 1, 23, 58))).toBeFalsy();
  });

  it('convertHoursToMap should  concat 0 before for pharmacy timing minutes when minutes are less than 10', () => {
    const time = '9:00 am to 8:00 am';
    expect(convertHoursToMap(mockPharmacies).get('Tuesday')).toBe(time);
  });
  it('convertHoursToMap should not concat 0 before for pharmacy timing minutes when minutes are greater than 10', () => {
    const time = '9:10 am to 9:15 pm';
    expect(convertHoursToMap(mockPharmacies).get('Monday')).toBe(time);
  });
  it('convertHoursToMap should return closed when opens and close timings are missing', () => {
    const time = 'closed';
    expect(convertHoursToMap(mockPharmacies).get('Sunday')).toBe(time);
  });
  it('convertHoursToMap should return `Open 24 hours` if pharmacy is open for 24 hours', () => {
    expect(convertHoursToMap(mockPharmacies).get('Wednesday')).toBe(
      'Open 24 hours'
    );
  });
});
describe('buildDispenseType', () => {
  const mockPharmaciesHours = [
    {
      closes: { h: 9, m: 10, pm: true },
      // no opens
    },
    {
      closes: { h: 9, m: 0, am: true },
      opens: { h: 9, m: 0, am: true },
    },
    {
      closes: { h: 9, m: 0, pm: true },
      opens: { h: 9, m: 0, pm: false },
    },
    {
      closes: { h: 9, m: 0, pm: true },
      opens: { h: 9, m: 0, pm: false },
    },
    {}, // no opens or closes
  ] as IHours[];
  const oct = 9;
  it('should return opens at 9 am the next day, when isPharmacyOpenNow is false', () => {
    expect(
      buildDispenseType(false, mockPharmaciesHours, new Date(2019, oct, 6))
    ).toBe('Opens at 9 am');
  });
  it('should return Open 24 hours when isPharmacyOpenNow is true and closing hours makes complete cycle ', () => {
    expect(
      buildDispenseType(true, mockPharmaciesHours, new Date(2019, oct, 7))
    ).toBe('Open 24 hours');
  });
  it('should return Closes at hours when isPharmacyOpenNow is true and closing hours less than 24 ', () => {
    expect(
      buildDispenseType(true, mockPharmaciesHours, new Date(2019, oct, 8, 10))
    ).toBe('Closes at 9 pm');
  });
  it('should return Currently Closed when isPharmacyOpenNow is false and there is no known opening time tomorrow', () => {
    expect(
      buildDispenseType(false, mockPharmaciesHours, new Date(2019, oct, 9, 10))
    ).toBe('Currently closed');
  });
  it('should return Currently Open when isPharmacyOpenNow is true and there is no opens or closes data', () => {
    expect(
      buildDispenseType(true, mockPharmaciesHours, new Date(2019, oct, 10, 10))
    ).toBe('Currently open');
  });
});
