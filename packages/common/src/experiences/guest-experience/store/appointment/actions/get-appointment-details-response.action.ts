// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentItem } from '../../../../../models/api-response/appointment.response';
import { IAppointmentAction } from './appointment-action';

export interface IGetAppointmentActionPayload {
  appointment?: IAppointmentItem;
  isCancelSuccessful?: boolean;
}

export type IGetAppointmentDetailsResponseAction = IAppointmentAction<
  'APPOINTMENT_DETAILS_RESPONSE',
  IGetAppointmentActionPayload
>;

export const getAppointmentDetailsResponseAction = (
  appointment?: IAppointmentItem,
  isCancelSuccessful?: boolean
): IGetAppointmentDetailsResponseAction => ({
  payload: { appointment, isCancelSuccessful },
  type: 'APPOINTMENT_DETAILS_RESPONSE',
});
