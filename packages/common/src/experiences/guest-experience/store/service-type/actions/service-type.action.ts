// Copyright 2020 Prescryptive Health, Inc.

export enum ServiceTypeActionKeysEnum {
  SET_SERVICE_TYPE = 'SET_SERVICE_TYPE',
  RESET_SERVICE_TYPE = 'RESET_SERVICE_TYPE',
  SET_SERVICE_DETAILS = 'SET_SERVICE_DETAILS',
}

export type ServiceTypeActionKeys = keyof typeof ServiceTypeActionKeysEnum;

export interface IServiceTypeAction<T extends ServiceTypeActionKeys, P> {
  readonly type: T;
  readonly payload: P;
}
