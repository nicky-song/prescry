// Copyright 2020 Prescryptive Health, Inc.

export enum CreateBookingActionKeysEnum {
  CREATE_BOOKING_RESPONSE = 'CREATE_BOOKING_RESPONSE',
  CREATE_BOOKING_ERROR = 'CREATE_BOOKING_ERROR',
}

export type CreateBookingActionKeys = keyof typeof CreateBookingActionKeysEnum;

export interface ICreateBookingAction<T extends CreateBookingActionKeys, P> {
  readonly type: T;
  readonly payload: P;
}
