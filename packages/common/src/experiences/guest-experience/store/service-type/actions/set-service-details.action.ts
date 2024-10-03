// Copyright 2021 Prescryptive Health, Inc.

import { IServiceTypeAction } from './service-type.action';

export interface ISetServiceDetailsActionType {
  serviceNameMyRx?: string;
  minimumAge?: number;
  cancellationPolicyMyRx?: string;
  aboutQuestionsDescriptionMyRx?: string;
  aboutDependentDescriptionMyRx?: string;
}
export type ISetServiceDetailsAction = IServiceTypeAction<
  'SET_SERVICE_DETAILS',
  ISetServiceDetailsActionType
>;

export const setServiceDetailsAction = (
  serviceDetailsPayload: ISetServiceDetailsActionType
): ISetServiceDetailsAction => ({
  payload: serviceDetailsPayload,
  type: 'SET_SERVICE_DETAILS',
});
