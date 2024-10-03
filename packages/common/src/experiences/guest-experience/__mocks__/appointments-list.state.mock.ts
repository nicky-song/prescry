// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentsListState } from "../state/appointments-list/appointments-list.state";

export const appointmentsListStateMock: IAppointmentsListState = {
  appointmentsType: 'upcoming',
  start: 0,
  appointments: [],
  allAppointmentsReceived: false,
  batchSize: 5,
};
