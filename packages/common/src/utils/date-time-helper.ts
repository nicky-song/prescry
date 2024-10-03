// Copyright 2018 Prescryptive Health, Inc.

import { IHour, IHours } from '../models/date-time/hours';
import { ITimeRange } from '../models/date-time/time-range';

export function differenceInYear(
  currentUtcTimeInSeconds: number,
  oldUtcTimeInSeconds: number
) {
  const differenceInSeconds = currentUtcTimeInSeconds - oldUtcTimeInSeconds;
  return Math.floor(differenceInSeconds / (60 * 60 * 24 * 365.25));
}

export const calculateMemberAge = (
  dateOfBirth: string,
  currentDate: Date = new Date()
) => {
  return differenceInYear(UTCDate(currentDate), UTCDate(new Date(dateOfBirth)));
};
export const UTCDate = (date: Date) => {
  return (
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ) / 1000
  );
};

export const UTCDateString = (dateString: string) => {
  const utcDate = new Date(dateString);

  const yearText = utcDate.getUTCFullYear();

  const month = utcDate.getUTCMonth() + 1;
  const monthText = month > 9 ? month : '0' + month;

  const day = utcDate.getUTCDate();
  const dayText = day > 9 ? day : '0' + day;

  return `${yearText}-${monthText}-${dayText}`;
};

export const CalculateAbsoluteAge = (now: Date, dateOfBirth: string) => {
  const yearNow = now.getUTCFullYear();
  const monthNow = now.getUTCMonth() + 1;
  const dateNow = now.getUTCDate();
  const dob = new Date(dateOfBirth);
  const yearDob = dob.getUTCFullYear();
  const monthDob = dob.getUTCMonth() + 1;
  const dateDob = dob.getUTCDate();
  let yearAge = yearNow - yearDob;
  const monthAge = monthNow - monthDob;
  if (monthAge < 0 || (monthAge === 0 && dateNow < dateDob)) {
    yearAge--;
  }
  return yearAge;
};

export const dateFromHour = (hour: IHour, now: Date): Date | undefined => {
  const { h: hr, m: minute = 0, pm: isPM } = hour;

  if (hr === undefined) {
    return undefined;
  }

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    isPM ? hr + 12 : hr,
    minute
  );
};

export const timeRangeFromHours = (
  hours: IHours,
  now: Date
): ITimeRange | undefined => {
  const { closes, opens } = hours;

  if (!closes || !opens) {
    return undefined;
  }

  const startTime = dateFromHour(opens, now);
  if (!startTime) {
    return undefined;
  }

  const endTime = dateFromHour(closes, now);
  if (!endTime) {
    return undefined;
  }

  return {
    start: startTime,
    end: endTime,
  };
};

export const dateFromISOString = (isoDateString?: string): Date | undefined => {
  if (!isoDateString) {
    return undefined;
  }

  const dateParts = isoDateString.split('-');

  const yearPart = parseInt(dateParts[0], 10);
  if (!yearPart) {
    return undefined;
  }

  const monthPart = parseInt(dateParts[1], 10) || 0;
  if (monthPart < 1 || monthPart > 12) {
    return undefined;
  }

  const dayPart = parseInt(dateParts[2], 10);
  if (!dayPart || dayPart > 31) {
    return undefined;
  }

  return new Date(yearPart, monthPart - 1, dayPart);
};
