// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentListItem } from '@phx/common/src/models/api-response/appointment.response';
import { IConfiguration } from '../../../configuration';
import { IAppointmentEvent } from '../../../models/appointment-event';
import { buildAppointmentListItem } from './build-appointment-list-item';

export const buildAppointmentList = async (
  configuration: IConfiguration,
  appointmentList: IAppointmentEvent[] | undefined
): Promise<IAppointmentListItem[]> => {
  const appointments: IAppointmentListItem[] = [];
  if (appointmentList && appointmentList.length > 0) {
    for (const item of appointmentList) {
      const appointment: IAppointmentListItem | undefined =
        await buildAppointmentListItem(item, configuration);
      if (appointment) {
        appointments.push(appointment);
      }
    }
  }
  return appointments;
};
