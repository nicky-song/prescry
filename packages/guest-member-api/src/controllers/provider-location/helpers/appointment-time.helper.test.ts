// Copyright 2020 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import {
  IAppointmentDateTime,
  splitAppointmentDateAndTime,
} from './appointment-time.helper';

describe('splitAppointmentDateAndTime', () => {
  it.each([
    [
      new Date('2020-06-24T08:00:00+0000'),
      ApiConstants.MONTH_DATE_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'June 24', time: '8:00 am' },
    ],
    [
      new Date('2020-06-23T13:00:00+0000'),
      ApiConstants.MONTH_DATE_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'June 23', time: '1:00 pm' },
    ],
    [
      new Date('2020-10-03T09:00:00+0000'),
      ApiConstants.MONTH_DATE_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'October 3', time: '9:00 am' },
    ],
    [
      new Date('2020-06-24T08:00:00+0000'),
      ApiConstants.DAY_MONTH_DATE_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'Wednesday, June 24th', time: '8:00 am' },
    ],
    [
      new Date('2020-06-23T13:00:00+0000'),
      ApiConstants.DAY_MONTH_DATE_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'Tuesday, June 23rd', time: '1:00 pm' },
    ],
    [
      new Date('2020-10-03T09:00:00+0000'),
      ApiConstants.DAY_MONTH_DATE_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'Saturday, October 3rd', time: '9:00 am' },
    ],
    [
      new Date('2020-06-24T08:00:00+0000'),
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'June 24, 2020', time: '8:00 am' },
    ],
    [
      new Date('2020-06-23T13:00:00+0000'),
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'June 23, 2020', time: '1:00 pm' },
    ],
    [
      new Date('2020-10-03T09:00:00+0000'),
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.SLOT_NAME_FORMAT,
      { date: 'October 3, 2020', time: '9:00 am' },
    ],
    [
      new Date('2020-10-03T09:00:00+0000'),
      ApiConstants.MONTH_DATE_YEAR_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT,
      { date: 'October 3, 2020', time: '9:00 AM' },
    ],
    [
      new Date('2020-06-04T08:00:00+0000'),
      ApiConstants.DATE_TEST_RESULT_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT,
      { date: '06/04/2020', time: '8:00 AM' },
    ],
    [
      new Date('2020-06-23T13:00:00+0000'),
      ApiConstants.DATE_TEST_RESULT_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT,
      { date: '06/23/2020', time: '1:00 PM' },
    ],
    [
      new Date('2020-10-03T11:00:00+0000'),
      ApiConstants.DATE_TEST_RESULT_FORMAT,
      ApiConstants.TIME_TEST_RESULT_FORMAT,
      { date: '10/03/2020', time: '11:00 AM' },
    ],
  ])(
    'splits the appointment time (%p) into date and time in a given format ',
    (
      start: Date,
      dateFormat: string,
      timeFormat: string,
      expectedDateObject: IAppointmentDateTime
    ) => {
      expect(
        splitAppointmentDateAndTime(start, dateFormat, timeFormat)
      ).toEqual(expectedDateObject);
    }
  );
});
