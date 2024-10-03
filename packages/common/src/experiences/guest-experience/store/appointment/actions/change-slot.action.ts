// Copyright 2021 Prescryptive Health, Inc.

import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { IAppointmentAction } from './appointment-action';

export type ISelectedSlot = IAvailableSlot & {
  bookingId?: string;
  slotExpirationDate?: Date;
};
export type IChangeSlotAction = IAppointmentAction<
  'APPOINTMENT_CHANGE_SLOT',
  ISelectedSlot
>;

export const setChangeSlotAction = (
  selectedSlot: ISelectedSlot
): IChangeSlotAction => ({
  payload: selectedSlot,
  type: 'APPOINTMENT_CHANGE_SLOT',
});
