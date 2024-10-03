// Copyright 2020 Prescryptive Health, Inc.

import { setCalendarMonthAction } from './set-calendar-month.action';

describe('setCalendarMonthAction', () => {
  it('returns action', () => {
    const currentMonth = '01-01-2000';
    const action = setCalendarMonthAction(currentMonth);
    expect(action.type).toEqual('APPOINTMENT_SET_CALENDAR_MONTH');
    expect(action.payload).toEqual(currentMonth);
  });
});
