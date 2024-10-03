// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import { AppointmentsListContext } from './appointments-list.context';
import {
  appointmentsListReducer,
  AppointmentsListReducer,
} from '../../../../experiences/guest-experience/state/appointments-list/appointments-list.reducer';
import {
  defaultAppointmentsListState,
} from '../../../../experiences/guest-experience/state/appointments-list/appointments-list.state';

export const AppointmentsListContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<AppointmentsListReducer>(
    appointmentsListReducer,
    defaultAppointmentsListState
  );
  return (
    <AppointmentsListContext.Provider
      value={{
        appointmentsListState: state,
        appointmentsListDispatch: dispatch,
      }}
    >
      {children}
    </AppointmentsListContext.Provider>
  );
};