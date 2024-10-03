// Copyright 2020 Prescryptive Health, Inc.

import { IServiceTypeAction } from './service-type.action';

export interface ISetServiceTypeActionType {
  type: string;
}
export type ISetServiceTypeAction = IServiceTypeAction<
  'SET_SERVICE_TYPE',
  ISetServiceTypeActionType
>;

export const setServiceTypeAction = (
  servicePayload: ISetServiceTypeActionType
): ISetServiceTypeAction => ({
  payload: servicePayload,
  type: 'SET_SERVICE_TYPE',
});
