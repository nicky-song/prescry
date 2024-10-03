// Copyright 2018 Prescryptive Health, Inc.

import {
  IPhoneNumberVerificationState,
  phoneNumberVerificationReducer,
  DefaultPhoneNumberVerificationState,
} from './phone-number-verification-reducer';

import {
  ISetVerificationCodeAction,
  PhoneNumberVerificationActionsKeys,
  PhoneNumberVerificationActionsType,
} from './actions/phone-number-verification.actions';

const initialState: IPhoneNumberVerificationState = {
  isIncorrectCode: false,
  isOneTimePasswordSent: false,
  verificationCode: undefined,
};

describe('phoneNumberVerificationReducer', () => {
  it('should set verificationCode', () => {
    const action: ISetVerificationCodeAction = {
      payload: {
        verificationCode: '123456',
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
    };
    const state = phoneNumberVerificationReducer(initialState, action);
    expect(state.verificationCode).toBe(action.payload.verificationCode);
  });

  it('should return default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as PhoneNumberVerificationActionsType;
    const result = phoneNumberVerificationReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should display message when isIncorrectCode is true', () => {
    const action: PhoneNumberVerificationActionsType = {
      payload: {
        isIncorrectCode: true,
      },
      type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE_ERROR_STATE,
    };
    const result = phoneNumberVerificationReducer(initialState, action);
    expect(result.isIncorrectCode).toEqual(action.payload.isIncorrectCode);
  });

  it('should display message when isOneTimePasswordSent is true', () => {
    const action: PhoneNumberVerificationActionsType = {
      payload: {
        isOneTimePasswordSent: true,
      },
      type: PhoneNumberVerificationActionsKeys.SET_SEND_ONE_TIME_PASSWORD_STATUS,
    };
    const result = phoneNumberVerificationReducer(initialState, action);
    expect(result.isOneTimePasswordSent).toEqual(
      action.payload.isOneTimePasswordSent
    );
  });

  it('should return default state when RESET_VERIFICATION_STATE action given', () => {
    const action: PhoneNumberVerificationActionsType = {
      type: PhoneNumberVerificationActionsKeys.RESET_VERIFICATION_STATE,
    };
    const result = phoneNumberVerificationReducer(initialState, action);
    expect(result).toEqual(DefaultPhoneNumberVerificationState);
  });
});
