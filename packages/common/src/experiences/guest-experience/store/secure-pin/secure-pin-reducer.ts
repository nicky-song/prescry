// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { SecurePinStateActionKeys } from './secure-pin-actions';
import { IDispatchSecurePinStateActionTypes } from './secure-pin-reducer.actions';

export interface ISecurePinState {
  createdPinHash?: string;
  hasPinMismatched: boolean;
  verifyPinHash?: string;
  numberOfFailedAttemptsToVerify: number;
  errorCode?: number;
  isAuthExperience: boolean;
  isUserAuthenticated?: boolean;
}

export const DefaultSecurePinState: ISecurePinState = {
  createdPinHash: undefined,
  hasPinMismatched: false,
  numberOfFailedAttemptsToVerify: 0,
  verifyPinHash: undefined,
  isAuthExperience: false,
  isUserAuthenticated: false,
};

export const securePinReducer: Reducer<
  ISecurePinState,
  IDispatchSecurePinStateActionTypes
> = (
  state: ISecurePinState = DefaultSecurePinState,
  action: IDispatchSecurePinStateActionTypes
) => {
  switch (action.type) {
    case SecurePinStateActionKeys.SET_HAS_PIN_MISMATCHED:
      return { ...state, hasPinMismatched: action.payload.hasPinMismatched };

    case SecurePinStateActionKeys.SET_ERROR_CODE:
      return { ...state, errorCode: action.payload.errorCode };

    case SecurePinStateActionKeys.SET_CREATED_PIN_TO_STATE:
      return { ...state, createdPinHash: action.payload.pinHash };

    case SecurePinStateActionKeys.SET_PIN_TO_BE_VERIFIED:
      return { ...state, verifyPinHash: action.payload.pinHash };

    case SecurePinStateActionKeys.SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY:
      return {
        ...state,
        numberOfFailedAttemptsToVerify:
          action.payload.numberOfFailedAttemptsToVerify,
      };
    case SecurePinStateActionKeys.SET_AUTH_EXPERIENCE:
      return {
        ...state,
        isAuthExperience: action.payload.isAuthExperience,
      };
    case SecurePinStateActionKeys.SET_USER_AUTHENTICATED:
      return {
        ...state,
        isUserAuthenticated: action.payload.isUserAuthenticated,
      };
    case SecurePinStateActionKeys.SET_PIN_STATE_DEFAULT:
      return {
        ...state,
        ...DefaultSecurePinState,
        isAuthExperience: state.isAuthExperience,
        isUserAuthenticated: state.isUserAuthenticated,
      };
  }
  return state;
};
