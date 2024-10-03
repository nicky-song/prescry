// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentListDetails } from '../../../components/member/lists/appointments-list/appointments-list';
import { appointmentsListMock } from './appointments-list.mock';
import { defaultAppointmentsListState } from '../../../experiences/guest-experience/state/appointments-list/appointments-list.state';
import { appointmentsListContent } from '../../../components/member/lists/appointments-list/appointments-list.content';

export const mockAppointmentListDetails: IAppointmentListDetails = {
  appointmentsType: defaultAppointmentsListState.appointmentsType,
  start: defaultAppointmentsListState.start,
  batchSize: appointmentsListContent.appointmentBatchSize,
  appointments: appointmentsListMock,
};