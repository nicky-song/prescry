// Copyright 2020 Prescryptive Health, Inc.

import {
  ISetCalendarDateAction,
  setCalendarDateAction,
} from '../actions/set-calendar-date.action';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';

export const setSelectedDateAsyncAction = (selectedDate: string) => {
  return async (
    dispatch: Dispatch<ISetCalendarDateAction>,
    getState: () => RootState
  ) => {
    const { appointment } = getState();
    const slotsForSelectedDate = appointment.availableSlots.filter(
      (x) => x.day === selectedDate
    );
    await dispatch(setCalendarDateAction(selectedDate, slotsForSelectedDate));
  };
};
