// Copyright 2020 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { ISetServiceTypeAction } from './actions/set-service-type.action';
import { IResetServiceTypeAction } from './actions/reset-service-type.action';
import { ISetServiceDetailsAction } from './actions/set-service-details.action';
export interface IServiceTypeState {
  readonly type: string | undefined;
  readonly serviceNameMyRx: string | undefined;
  readonly minimumAge?: number;
  readonly cancellationPolicyMyRx?: string;
  readonly aboutQuestionsDescriptionMyRx?: string;
  readonly aboutDependentDescriptionMyRx?: string;
}

export type IDispatchServiceTypeStateActionTypes =
  | ISetServiceTypeAction
  | IResetServiceTypeAction
  | ISetServiceDetailsAction;

export const defaultServiceTypeState: IServiceTypeState = {
  type: undefined,
  serviceNameMyRx: undefined,
};

export const serviceTypeReducer: Reducer<
  IServiceTypeState,
  IDispatchServiceTypeStateActionTypes
> = (
  state: IServiceTypeState = defaultServiceTypeState,
  action: IDispatchServiceTypeStateActionTypes
) => {
  switch (action.type) {
    case 'SET_SERVICE_TYPE':
      return {
        ...state,
        type: action.payload.type,
      };
    case 'RESET_SERVICE_TYPE':
      return {
        ...state,
        type: undefined,
      };
    case 'SET_SERVICE_DETAILS':
      return {
        ...state,
        serviceNameMyRx: action.payload.serviceNameMyRx,
        minimumAge: action.payload.minimumAge,
        cancellationPolicyMyRx: action.payload.cancellationPolicyMyRx,
        aboutQuestionsDescriptionMyRx:
          action.payload.aboutQuestionsDescriptionMyRx,
        aboutDependentDescriptionMyRx:
          action.payload.aboutDependentDescriptionMyRx,
      };
  }

  return state;
};
