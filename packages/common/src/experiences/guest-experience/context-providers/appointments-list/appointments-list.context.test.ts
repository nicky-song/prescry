// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultAppointmentsListState } from '../../../../experiences/guest-experience/state/appointments-list/appointments-list.state';
import {
  IAppointmentsListContext,
  AppointmentsListContext,
} from './appointments-list.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));

const createContextMock = createContext as jest.Mock;

describe('AppointmentsListContext', () => {
  it('creates context', () => {
    expect(AppointmentsListContext).toBeDefined();

    const expectedContext: IAppointmentsListContext = {
      appointmentsListState: defaultAppointmentsListState,
      appointmentsListDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
