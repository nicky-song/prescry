// Copyright 2018 Prescryptive Health, Inc.

import { IHours } from '../../models/date-time/hours';
import DateFormatter, { IOpenStatusContent } from './date.formatter';

describe('DateFormatter', () => {
  const formatLocalTime = (date: Date): string =>
    date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: 'numeric',
    });

  it.each([
    [new Date(2019, 11, 1), '12/01/19'],
    [new Date(2019, 0, 1), '01/01/19'],
    [new Date(2019, 11, 11), '12/11/19'],
  ])('formats %p as mm/dd/yy', (dateMock: Date, expected: string) => {
    expect(DateFormatter.formatToMDY(dateMock)).toEqual(expected);
  });

  it.each([
    [new Date(2019, 11, 1), '12/01/2019'],
    [new Date(2019, 0, 1), '01/01/2019'],
    [new Date(2019, 11, 11), '12/11/2019'],
  ])('formats %p as mm/dd/yyyy', (dateMock: Date, expected: string) => {
    expect(DateFormatter.formatToMMDDYYYY(dateMock)).toEqual(expected);
  });

  it.each([
    [new Date(2019, 11, 1), '2019-12-01'],
    [new Date(2019, 0, 1), '2019-01-01'],
    [new Date(2019, 11, 11), '2019-12-11'],
    ['Mon Jan 19 1970 17:44:38 GMT-0800 (Pacific Standard Time)', '1970-01-20'],
    ['2019, 01, 1', '2019-01-01'],
    ['2019, 11, 11', '2019-11-11'],
  ])(
    'formats %p as yyyy-mm-dd',
    (dateMock: Date | string, expected: string) => {
      expect(DateFormatter.formatToYMD(dateMock)).toEqual(expected);
    }
  );

  it.each([
    ['June-30-2004', 'June-30-2004'],
    [
      'Wed Feb 01 2006 16:00:00 GMT-0800 (Pacific Standard Time)',
      'February-02-2006',
    ],
  ])('formats %p as month-dd-yyyy', (dateMock: string, expected: string) => {
    expect(DateFormatter.formatToMonthDDYYYY(dateMock)).toEqual(expected);
  });

  it.each([
    ['Feb 01 2006', 'Wednesday'],
    ['', undefined],
  ])(
    'retrieves day from %p',
    (dateString: string, expectedDay: string | undefined) => {
      expect(DateFormatter.getDayFromDate(dateString)).toEqual(expectedDay);
    }
  );

  const sunHoursMock: IHours = {
    day: 'Sun',
  };
  const monHoursMock: IHours = {
    day: 'Mon',
    opens: {
      h: 8,
      m: 30,
    },
    closes: {
      h: 4,
      pm: true,
    },
  };

  const sundayTime = new Date(2021, 4, 16, 12);
  const mondayStartTime = new Date(2021, 4, 17, 8, 30);
  const mondayBeforeTime = new Date(mondayStartTime.getTime() - 1);
  const mondayDuringTime = new Date(2021, 4, 17, 8, 30);
  const mondayEndTime = new Date(2021, 4, 17, 16, 0);
  const mondayAfterTime = new Date(mondayEndTime.getTime() + 1);
  const tuesdayTime = new Date(2021, 4, 18);

  const opensAtPrefix = 'opens at {opens}';
  const closesAtPrefix = 'closes at {closes}';

  const contentMock: IOpenStatusContent = {
    closed: 'closed',
    open: 'open',
    open24Hours: 'open-24-hours',
    opensAt: opensAtPrefix,
    closesAt: closesAtPrefix,
  };

  it.each([
    [[sunHoursMock, monHoursMock], false, sundayTime, contentMock.closed],
    [[sunHoursMock, monHoursMock], true, sundayTime, contentMock.open24Hours],
    [
      [sunHoursMock, monHoursMock],
      false,
      mondayBeforeTime,
      `opens at ${formatLocalTime(mondayStartTime)}`,
    ],
    [
      [sunHoursMock, monHoursMock],
      false,
      mondayDuringTime,
      `closes at ${formatLocalTime(mondayEndTime)}`,
    ],
    [[sunHoursMock, monHoursMock], false, mondayAfterTime, contentMock.closed],
    [
      [sunHoursMock, monHoursMock],
      true,
      mondayAfterTime,
      contentMock.open24Hours,
    ],
    [[sunHoursMock, monHoursMock], false, tuesdayTime, contentMock.closed],
    [[sunHoursMock, monHoursMock], true, tuesdayTime, contentMock.open24Hours],
  ])(
    'formats open status (dailyHours: %p, open24Hours: %p, now: %p)',
    (
      dailyHoursMock: IHours[],
      isOpen24HoursMock: boolean,
      nowMock: Date,
      expectedContent
    ) => {
      expect(
        DateFormatter.formatOpenStatus(
          nowMock,
          dailyHoursMock,
          isOpen24HoursMock,
          contentMock
        )
      ).toEqual(expectedContent);
    }
  );

  it('formats date of birth string to expected date', () => {
    const dateString = '2000-01-01';
    const expectedDate = new Date(2000, 0, 1);

    expect(DateFormatter.convertDateOfBirthToDate(dateString)).toEqual(
      expectedDate
    );
  });

  it('formats local date to Month DD, YYYY', () => {
    const timeMock = new Date();

    expect(DateFormatter.formatLocalDate(timeMock)).toEqual(
      timeMock.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  });

  it('converts string to date', () => {
    const timeMock = new Date();

    expect(DateFormatter.formatLocalDate(timeMock)).toEqual(
      timeMock.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  });

  it('converts dateString to the format "YYYY-MM-DDTHH:MM:SS.000Z" to be supported by all browsers', () => {
    const dateString = 'December-20-2000';
    const expectedDate = new Date(dateString);
    expect(DateFormatter.firefoxCompatibleDateFormat(dateString)).toEqual(
      expectedDate
    );

    expect(
      DateFormatter.firefoxCompatibleDateFormat('December/20/2000')
    ).toEqual(expectedDate);

    expect(
      DateFormatter.firefoxCompatibleDateFormat(
        'some invalid date string'
      ).toString()
    ).toBe('Invalid Date');
  });

  it.each([
    ['12-1-2019', '12/01/2019'],
    ['1-12-2019', '01/12/2019'],
    ['11-13-2019', '11/13/2019'],
    ['3-4-2019', '03/04/2019'],
    ['12/1/2019', '12/01/2019'],
    ['1/12/2019', '01/12/2019'],
    ['11/13/2019', '11/13/2019'],
    ['3/4/2019', '03/04/2019'],
    ['2019-12-1', '12/01/2019'],
    ['2019-1-12', '01/12/2019'],
    ['2019-11-13', '11/13/2019'],
    ['2019-3-4', '03/04/2019'],
    ['2019/12/1', '12/01/2019'],
    ['2019/1/12', '01/12/2019'],
    ['2019/11/13', '11/13/2019'],
    ['2019/3/4', '03/04/2019'],
    ['', undefined],
  ])(
    'formats %s as %s with / as separator using formatStringToMMDDYYYY helper function',
    (inputDate: string, outputStringDate: string | undefined) => {
      expect(DateFormatter.formatStringToMMDDYYYY(inputDate)).toEqual(
        outputStringDate
      );
    }
  );

  it.each([
    ['12-1-2019', '12-01-2019'],
    ['1-12-2019', '01-12-2019'],
    ['11-13-2019', '11-13-2019'],
    ['3-4-2019', '03-04-2019'],
    ['12/1/2019', '12-01-2019'],
    ['1/12/2019', '01-12-2019'],
    ['11/13/2019', '11-13-2019'],
    ['3/4/2019', '03-04-2019'],
    ['2019-12-1', '12-01-2019'],
    ['2019-1-12', '01-12-2019'],
    ['2019-11-13', '11-13-2019'],
    ['2019-3-4', '03-04-2019'],
    ['2019/12/1', '12-01-2019'],
    ['2019/1/12', '01-12-2019'],
    ['2019/11/13', '11-13-2019'],
    ['2019/3/4', '03-04-2019'],
    ['', undefined],
  ])(
    'formats %s as %s with - as separator using formatStringToMMDDYYYY helper function',
    (inputDate: string, outputStringDate: string | undefined) => {
      expect(DateFormatter.formatStringToMMDDYYYY(inputDate, '-')).toEqual(
        outputStringDate
      );
    }
  );
});
