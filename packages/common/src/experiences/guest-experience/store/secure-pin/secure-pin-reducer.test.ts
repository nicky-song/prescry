// Copyright 2018 Prescryptive Health, Inc.

import { DefaultSecurePinState, securePinReducer } from './secure-pin-reducer';
import {
  IDispatchSecurePinStateActionTypes,
  ISetAuthExperienceAction,
  ISetUserAuthenticatedAction,
} from './secure-pin-reducer.actions';
import { SecurePinStateActionKeys } from './secure-pin-actions';

const initialState = {
  createdPinHash: undefined,
  hasPinMismatched: false,
  numberOfFailedAttemptsToVerify: 0,
  verifyPinHash: undefined,
  isAuthExperience: false,
  isUserAuthenticated: false,
};

describe('securePinReducer', () => {
  it('should return default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as IDispatchSecurePinStateActionTypes;

    expect(securePinReducer(undefined, action)).toEqual(initialState);
  });

  it('should set hasPinMismatched flag action', () => {
    const action = {
      payload: {
        hasPinMismatched: true,
      },
      type: SecurePinStateActionKeys.SET_HAS_PIN_MISMATCHED,
    } as unknown as IDispatchSecurePinStateActionTypes;
    const newState = { ...initialState, hasPinMismatched: true };

    expect(securePinReducer(undefined, action)).toEqual(newState);
  });

  it('should set errorCode on SET_ERROR_CODE action', () => {
    const action = {
      payload: {
        errorCode: 2009,
      },
      type: SecurePinStateActionKeys.SET_ERROR_CODE,
    } as unknown as IDispatchSecurePinStateActionTypes;
    const newState = { ...initialState, errorCode: 2009 };

    expect(securePinReducer(undefined, action)).toEqual(newState);
  });

  it('should set createdPin flag action', () => {
    const action = {
      payload: {
        pinHash: '1234',
      },
      type: SecurePinStateActionKeys.SET_CREATED_PIN_TO_STATE,
    } as unknown as IDispatchSecurePinStateActionTypes;
    const newState = { ...initialState, createdPinHash: '1234' };

    expect(securePinReducer(undefined, action)).toEqual(newState);
  });

  it('should set verifyPinHash action', () => {
    const action = {
      payload: {
        pinHash: '1234',
      },
      type: SecurePinStateActionKeys.SET_PIN_TO_BE_VERIFIED,
    } as unknown as IDispatchSecurePinStateActionTypes;
    const newState = { ...initialState, verifyPinHash: '1234' };

    expect(securePinReducer(undefined, action)).toEqual(newState);
  });

  it('should set default pin state action', () => {
    const action = {
      payload: {
        isAuthExperience: false,
        isUserAuthenticated: false,
      },
      type: SecurePinStateActionKeys.SET_PIN_STATE_DEFAULT,
    } as unknown as IDispatchSecurePinStateActionTypes;

    const newState = {
      ...initialState,
      isAuthExperience: true,
      isUserAuthenticated: true,
    };

    expect(securePinReducer(newState, action)).toEqual(newState);
  });

  it('should set numberOfFailedAttemptsToVerify for PIN verify action ', () => {
    const action = {
      payload: {
        numberOfFailedAttemptsToVerify: 3,
      },
      type: SecurePinStateActionKeys.SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY,
    } as unknown as IDispatchSecurePinStateActionTypes;
    const newState = { ...initialState, numberOfFailedAttemptsToVerify: 3 };

    expect(securePinReducer(undefined, action)).toEqual(newState);
  });

  it('should set isAuthExperience for SET_AUTH_EXPERIENCE action ', () => {
    const action = {
      payload: {
        isAuthExperience: true,
      },
      type: SecurePinStateActionKeys.SET_AUTH_EXPERIENCE,
    } as ISetAuthExperienceAction as IDispatchSecurePinStateActionTypes;
    const newState = { ...DefaultSecurePinState, isAuthExperience: true };

    expect(securePinReducer(DefaultSecurePinState, action)).toEqual(newState);
  });

  it('should set isUserAuthenticated for SET_USER_AUTHENTICATED action ', () => {
    const action = {
      payload: {
        isUserAuthenticated: true,
      },
      type: SecurePinStateActionKeys.SET_USER_AUTHENTICATED,
    } as ISetUserAuthenticatedAction as IDispatchSecurePinStateActionTypes;
    const newState = { ...DefaultSecurePinState, isUserAuthenticated: true };

    expect(securePinReducer(DefaultSecurePinState, action)).toEqual(newState);
  });
});
