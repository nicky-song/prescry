// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import {
  defaultAppointmentsListState,
  IAppointmentsListState,
} from '../../../../experiences/guest-experience/state/appointments-list/appointments-list.state';
import { AppointmentsListDispatch } from '../../../../experiences/guest-experience/state/appointments-list/dispatch/appointments-list.dispatch';

export interface IAppointmentsListContext {
  readonly appointmentsListState: IAppointmentsListState;
  readonly appointmentsListDispatch: AppointmentsListDispatch;
}

export const AppointmentsListContext = createContext<IAppointmentsListContext>({
  appointmentsListState: defaultAppointmentsListState,
  appointmentsListDispatch: () => {
    return;
  },
});
