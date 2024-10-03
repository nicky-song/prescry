// Copyright 2022 Prescryptive Health, Inc.

import moment from 'moment';

export const isDateInBetween = (from: string, to: string, check: Date) => {
  const compareDate = moment(check, 'YYYY/MM/DD');
  const startDate = moment(from, 'YYYY/MM/DD');
  const endDate = moment(to, 'YYYY/MM/DD');

  if (!compareDate.isValid() || !startDate.isValid() || !endDate.isValid()) {
    return false;
  }

  return compareDate.isBetween(startDate, endDate, 'day', '[]');
};
