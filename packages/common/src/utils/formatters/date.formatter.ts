// Copyright 2018 Prescryptive Health, Inc.

import { IHours } from '../../models/date-time/hours';
import { timeRangeFromHours } from '../date-time-helper';
import { StringFormatter } from './string.formatter';

const formatToMDY = (date: Date) => {
  const month = formatMonth(date.getMonth());
  const day = formatDay(date.getDate());
  const year = formatYearAsTwoDigits(date.getFullYear());

  return month + '/' + day + '/' + year;
};

const formatToMMDDYYYY = (date: Date) => {
  const month = formatMonth(date.getMonth());
  const day = formatDay(date.getDate());
  const year = date.getFullYear();

  return month + '/' + day + '/' + year;
};

const formatStringToMMDDYYYY = (date: string, separator = '/') => {
  if (date === '') {
    return undefined;
  }
  const dateObject = new Date(date.replace(/-/g, '/'));

  return (
    ('0' + (dateObject.getMonth() + 1)).slice(-2) +
    separator +
    ('0' + dateObject.getDate()).slice(-2) +
    separator +
    dateObject.getFullYear()
  );
};

const formatToYMD = (date: Date | string) => {
  const convertedDate =
    typeof date === 'string' ? firefoxCompatibleDateFormat(date) : date;

  const years = convertedDate.getUTCFullYear().toString();
  const days = padZeroToDate(convertedDate.getUTCDate());
  const month = formatMonth(convertedDate.getUTCMonth());
  return `${years}-${month}-${days}`;
};

const formatMonth = (month: number): string => {
  month += 1;
  if (month > 9) {
    return month.toString();
  }
  return '0' + month;
};

const formatDay = (day: number): string => {
  if (day > 9) {
    return day.toString();
  }
  return '0' + day;
};

const formatYearAsTwoDigits = (year: number): string => {
  return year.toString().slice(-2);
};

const formatToMonthDDYYYY = (date: string) => {
  const convertedDate = firefoxCompatibleDateFormat(date);
  const years = convertedDate.getUTCFullYear().toString();
  const days = padZeroToDate(convertedDate.getUTCDate());
  const months = monthList[convertedDate.getUTCMonth()];
  return `${months}-${days}-${years}`;
};

const getDayFromDate = (date: string) => {
  if (date === '') {
    return undefined;
  }
  const convertedDate = new Date(date);
  return daysOfWeek[convertedDate.getDay()];
};

const padZeroToDate = (date: number) => date.toString().padStart(2, '0');

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface IOpenStatusContent {
  open24Hours: string;
  closed: string;
  open: string;
  opensAt: string;
  closesAt: string;
}

const formatOpenStatus = (
  now: Date,
  hours: IHours[],
  isOpenTwentyFourHours: boolean,
  content: IOpenStatusContent
): string => {
  if (isOpenTwentyFourHours) {
    return content.open24Hours;
  }

  const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayKey = dayKeys[now.getDay()];

  const hoursForToday = hours.find(
    (hoursForDay) => hoursForDay.day === todayKey
  );
  const timeRangeForToday = hoursForToday
    ? timeRangeFromHours(hoursForToday, now)
    : undefined;

  if (!timeRangeForToday) {
    return content.closed;
  }

  const { start, end } = timeRangeForToday;
  if (now < start) {
    return StringFormatter.format(
      content.opensAt,
      new Map([['opens', formatLocalTime(start)]])
    );
  }

  if (now > end) {
    return content.closed;
  }

  return StringFormatter.format(
    content.closesAt,
    new Map([['closes', formatLocalTime(end)]])
  );
};

const formatLocalTime = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
  });

const formatLocalDate = (date: Date): string =>
  date.toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const convertDateOfBirthToDate = (date = '') => {
  const [year, month, day] = date.split('-');
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
};

const firefoxCompatibleDateFormat = (date: string) => {
  let convertedDate = new Date(date);
  const isValidDate =
    convertedDate instanceof Date && !isNaN(convertedDate.valueOf());
  if (!isValidDate && date) {
    convertedDate = new Date(date.replace(/-/g, '/'));
  }
  return convertedDate;
};

export default {
  formatLocalDate,
  formatLocalTime,
  formatOpenStatus,
  formatStringToMMDDYYYY,
  formatToMDY,
  formatToYMD,
  formatToMonthDDYYYY,
  getDayFromDate,
  convertDateOfBirthToDate,
  formatToMMDDYYYY,
  firefoxCompatibleDateFormat,
};
