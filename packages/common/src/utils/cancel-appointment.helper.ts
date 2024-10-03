// Copyright 2021 Prescryptive Health, Inc.

import moment from 'moment';

export const checkCancellableAppointment = (
  cancelWindowHours: number,
  startInUtc?: Date
) => {
  return (
    startInUtc &&
    moment(startInUtc).add(-cancelWindowHours, 'hours').isAfter(moment.utc())
  );
};
