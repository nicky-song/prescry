// Copyright 2020 Prescryptive Health, Inc.

import {
  setCalendarStatusAction,
  ICalendarStatus,
} from './set-calendar-status.action';

describe('setCalendarStatusAction', () => {
  it('returns action', () => {
    const availableSlotsData: ICalendarStatus = {
      slots: [
        {
          start: '2020-06-22T08:00:00',
          day: '2020-06-22',
          slotName: '8:15 am',
        },
      ],
      markedDates: {
        '2020-06-22': {
          disabled: true,
          disableTouchEvent: true,
        },
      },
    };
    const action = setCalendarStatusAction(availableSlotsData);
    expect(action.type).toEqual('APPOINTMENT_SET_CALENDAR_STATUS');
    expect(action.payload).toEqual(availableSlotsData);
  });
});
