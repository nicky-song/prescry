// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment';
export type DateItemValue = number | string;

function isDateValid(
  year: DateItemValue,
  month: DateItemValue,
  day: DateItemValue
): boolean {
  if (!isDayValid(day) || !isMonthValid(month) || !isYearValid(year)) {
    return false;
  }

  return isValid(Number(year), Number(month), Number(day));
}

function isDayValid(day: DateItemValue): boolean {
  const dayValue = Number(day);
  return (
    !isNaN(dayValue) &&
    Number.isInteger(dayValue) &&
    dayValue > 0 &&
    dayValue <= 31
  );
}

function isMonthValid(month: DateItemValue): boolean {
  const monthValue = Number(month);
  return (
    !isNaN(monthValue) &&
    Number.isInteger(monthValue) &&
    monthValue > 0 &&
    monthValue <= 12
  );
}

function isYearValid(year: DateItemValue, minimumYear = 1): boolean {
  const yearValue = Number(year);
  return (
    !isNaN(yearValue) && Number.isInteger(yearValue) && yearValue >= minimumYear
  );
}

function isValid(year: number, month: number, day: number): boolean {
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) {
    return false;
  }

  if (isLeapYear(year)) {
    return true;
  }

  return month !== 2 || day <= 28;
}

function isLeapYear(year: number): boolean {
  if (year % 4 !== 0) {
    return false;
  }

  return year % 100 !== 0 || year % 400 === 0;
}

const isDateOfBirthValid = (date: string) => {
  const dateArray = date.split('-');
  const meetsRequirements =
    !date.includes('mm') &&
    !date.includes('dd') &&
    !date.includes('yyyy') &&
    dateArray.length === 3;
  if (!meetsRequirements) {
    return false;
  }
  const month = moment().month(dateArray[0]).format('M');
  return DateValidator.isDateValid(dateArray[2], month, dateArray[1]);
};

const DateValidator = {
  isDateValid,
  isDayValid,
  isMonthValid,
  isYearValid,
  isDateOfBirthValid,
};
export default DateValidator;
