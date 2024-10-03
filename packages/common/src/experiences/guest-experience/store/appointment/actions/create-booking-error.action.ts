// Copyright 2020 Prescryptive Health, Inc.

import { ICreateBookingAction } from './create-booking-action';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';

export interface ICreateBookingErrorActionPayload {
  error: string;
  updatedSlots: IAvailableSlot[];
}
export type ICreateBookingErrorAction = ICreateBookingAction<
  'CREATE_BOOKING_ERROR',
  ICreateBookingErrorActionPayload
>;

export const createBookingErrorAction = (
  error: string,
  updatedSlots: IAvailableSlot[]
): ICreateBookingErrorAction => ({
  payload: { error, updatedSlots },
  type: 'CREATE_BOOKING_ERROR',
});
