// Copyright 2020 Prescryptive Health, Inc.

import { ICreateBookingNewDependentAction } from './create-booking-new-dependent.action';

export interface ICreateBookingNewDependentErrorActionPayload {
  error: string;
}
export type ICreateBookingNewDependentErrorAction =
  ICreateBookingNewDependentAction<
    'CREATE_BOOKING_NEW_DEPENDENT_ERROR',
    ICreateBookingNewDependentErrorActionPayload
  >;

export const createBookingNewDependentErrorAction = (
  error: string
): ICreateBookingNewDependentErrorAction => ({
  payload: { error },
  type: 'CREATE_BOOKING_NEW_DEPENDENT_ERROR',
});
