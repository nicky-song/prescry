// Copyright 2021 Prescryptive Health, Inc.

import { IServiceTypeAction } from './service-type.action';

export type IResetServiceTypeAction = IServiceTypeAction<
  'RESET_SERVICE_TYPE',
  undefined
>;

export const resetServiceTypeAction = (): IResetServiceTypeAction => ({
  payload: undefined,
  type: 'RESET_SERVICE_TYPE',
});
