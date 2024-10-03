// Copyright 2020 Prescryptive Health, Inc.

import { setSelectedDateAsyncAction } from './set-selected-date.async-action';
import { setCalendarDateAction } from '../actions/set-calendar-date.action';

jest.mock('../actions/set-calendar-date.action');
const setCalendarDateActionMock = setCalendarDateAction as jest.Mock;

const getStateMock = jest.fn();
const defaultStateMock = {
  appointment: {
    availableSlots: [
      {
        start: '2020-06-22T08:00:00',
        slotName: '8:00 am',
        day: '2020-06-22',
      },
      {
        start: '2020-06-22T08:15:00',
        slotName: '8:15 am',
        day: '2020-06-22',
      },
      {
        start: '2020-06-22T16:45:00',
        slotName: '4:45 pm',
        day: '2020-06-22',
      },
      {
        start: '2020-06-23T09:45:00',
        slotName: '9:45 am',
        day: '2020-06-23',
      },
      {
        start: '2020-06-21T17:30:00',
        slotName: '5:30 pm',
        day: '2020-06-21',
      },
      {
        start: '2020-06-21T17:45:00',
        slotName: '5:45 pm',
        day: '2020-06-21',
      },
      {
        start: '2020-06-22T11:15:00',
        slotName: '11:15 am',
        day: '2020-06-22',
      },
      {
        start: '2020-06-22T17:30:00',
        slotName: '5:30 pm',
        day: '2020-06-22',
      },
      {
        start: '2020-06-22T17:45:00',
        slotName: '5:45 pm',
        day: '2020-06-22',
      },
    ],
  },
};
describe('setSelectedDateAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
    setCalendarDateActionMock.mockReset();
  });

  it('dispatches setCalendarDateAction after filtering the slot for the day', async () => {
    const dispatchMock = jest.fn();

    const asyncAction = setSelectedDateAsyncAction('2020-06-21');
    await asyncAction(dispatchMock, getStateMock);
    expect(setCalendarDateActionMock).toHaveBeenCalledWith('2020-06-21', [
      {
        start: '2020-06-21T17:30:00',
        slotName: '5:30 pm',
        day: '2020-06-21',
      },
      {
        start: '2020-06-21T17:45:00',
        slotName: '5:45 pm',
        day: '2020-06-21',
      },
    ]);
  });
});
