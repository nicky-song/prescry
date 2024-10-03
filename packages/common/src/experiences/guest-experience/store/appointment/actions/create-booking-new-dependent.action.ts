// Copyright 2020 Prescryptive Health, Inc.

export enum CreateBookingNewDependentActionKeysEnum {
  CREATE_BOOKING_NEW_DEPENDENT_ERROR = 'CREATE_BOOKING_NEW_DEPENDENT_ERROR',
}

export type CreateBookingNewDependentActionKeys =
  keyof typeof CreateBookingNewDependentActionKeysEnum;

export interface ICreateBookingNewDependentAction<
  T extends CreateBookingNewDependentActionKeys,
  P
> {
  readonly type: T;
  readonly payload: P;
}
