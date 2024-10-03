// Copyright 2020 Prescryptive Health, Inc.

import { setCalendarDateAction } from './set-calendar-date.action';

describe('setCalendarDateAction', () => {
  it('returns action', () => {
    const selectedDate = '01-01-2000';
    const action = setCalendarDateAction(selectedDate, []);
    expect(action.type).toEqual('APPOINTMENT_SET_CALENDAR_DATE');
    expect(action.payload).toEqual({ selectedDate, slotsForSelectedDate: [] });
  });
});
