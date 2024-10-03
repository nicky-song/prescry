// Copyright 2018 Prescryptive Health, Inc.

import {
  IPhoneNumberLoginState,
  phoneNumberLoginReducer,
} from './phone-number-login.reducer';
import {
  IOnSetPhoneNumberAction,
  IOnUnsupportedPhoneNumberTypeAction,
  PhoneNumberLoginActionsKeys,
  PhoneNumberLoginActionsType,
} from './phone-number-login.reducer.action';

const initialState: IPhoneNumberLoginState = {
  phoneNumber: undefined,
  phoneNumberTypeIsUnsupported: false,
};

describe('PhoneNumberLoginReducer', () => {
  it('should set phone number', () => {
    const action: IOnSetPhoneNumberAction = {
      payload: {
        phoneNumber: '1234567890',
      },
      type: PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER,
    };
    const state = phoneNumberLoginReducer(initialState, action);
    expect(state.phoneNumber).toBe(action.payload.phoneNumber);
  });

  it('should set phoneNumberTypeIsUnsupported flag when unable to send text message to that phone number', () => {
    const action: IOnUnsupportedPhoneNumberTypeAction = {
      payload: {
        phoneNumberTypeIsUnsupported: true,
      },
      type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED,
    };
    const state = phoneNumberLoginReducer(initialState, action);
    expect(state.phoneNumberTypeIsUnsupported).toBe(
      action.payload.phoneNumberTypeIsUnsupported
    );
  });

  it('should return default state when state is not defined', () => {
    const action = {
      payload: undefined,
      type: '',
    } as unknown as PhoneNumberLoginActionsType;
    const result = phoneNumberLoginReducer(undefined, action);
    expect(result).toEqual(initialState);
  });
});
