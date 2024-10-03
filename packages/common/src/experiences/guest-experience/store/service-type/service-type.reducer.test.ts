// Copyright 2020 Prescryptive Health, Inc.

import { serviceTypeReducer, IServiceTypeState } from './service-type.reducer';
import { ISetServiceTypeAction } from './actions/set-service-type.action';
import { ServiceTypeActionKeysEnum } from './actions/service-type.action';
import { IResetServiceTypeAction } from './actions/reset-service-type.action';
import {
  ISetServiceDetailsAction,
  ISetServiceDetailsActionType,
} from './actions/set-service-details.action';

const initialState: IServiceTypeState = {
  type: undefined,
  serviceNameMyRx: undefined,
};

describe('serviceTypeReducer', () => {
  it('should return default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as ISetServiceTypeAction;

    expect(serviceTypeReducer(undefined, action)).toEqual(initialState);
  });

  it('should set serviceType details', () => {
    const action = {
      payload: {
        type: 'service-type',
        serviceName: 'mock-service-name',
      },
      type: ServiceTypeActionKeysEnum.SET_SERVICE_TYPE,
    } as ISetServiceTypeAction;
    const state = serviceTypeReducer(undefined, action);

    expect(state.type).toEqual(action.payload.type);
  });
  it('should reset serviceType details', () => {
    const action = {
      type: ServiceTypeActionKeysEnum.RESET_SERVICE_TYPE,
    } as IResetServiceTypeAction;
    const state = serviceTypeReducer(undefined, action);
    expect(state.type).toEqual(undefined);
  });

  it('should set service collection details', () => {
    const servicePayload = {
      serviceNameMyRx: 'service-name',
      minimumAge: 3,
      cancellationPolicyMyRx: 'cancellation text',
      aboutQuestionsDescriptionMyRx: 'questions descriptions',
      aboutDependentDescriptionMyRx: 'dependent sub header text',
    } as ISetServiceDetailsActionType;
    const action = {
      payload: servicePayload,
      type: ServiceTypeActionKeysEnum.SET_SERVICE_DETAILS,
    } as ISetServiceDetailsAction;
    const state = serviceTypeReducer(undefined, action);
    expect(state).toEqual(servicePayload);
  });
});
