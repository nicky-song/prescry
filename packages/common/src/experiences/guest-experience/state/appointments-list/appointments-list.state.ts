// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentListItem } from '../../../../models/api-response/appointment.response';
import { IAppointmentType } from '../../../../components/member/lists/appointments-list/appointments-list';
import { appointmentsListContent } from '../../../../components/member/lists/appointments-list/appointments-list.content';

export interface IAppointmentsListState {
  appointmentsType: IAppointmentType;
  start: number;
  appointments: IAppointmentListItem[];
  allAppointmentsReceived: boolean;
  batchSize: number;
}

export const defaultAppointmentsListState: IAppointmentsListState = {
  appointmentsType: 'upcoming',
  start: 0,
  appointments: [],
  allAppointmentsReceived: false,
  batchSize: appointmentsListContent.appointmentBatchSize,
};
