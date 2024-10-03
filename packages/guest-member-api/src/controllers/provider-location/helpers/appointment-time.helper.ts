// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment';

export type IAppointmentDateTime = {
  date: string;
  time: string;
};
export function splitAppointmentDateAndTime(
  appointmentTime: Date,
  dateFormat: string,
  timeFormat: string
): IAppointmentDateTime {
  const appointmentTimeMoment = moment.utc(appointmentTime);
  return {
    date: appointmentTimeMoment.format(dateFormat),
    time: appointmentTimeMoment.format(timeFormat),
  };
}
