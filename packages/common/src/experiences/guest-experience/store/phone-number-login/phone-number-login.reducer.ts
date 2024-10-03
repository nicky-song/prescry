// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import {
  PhoneNumberLoginActionsKeys,
  PhoneNumberLoginActionsType,
} from './phone-number-login.reducer.action';

export interface IPhoneNumberLoginState {
  readonly phoneNumber?: string;
  readonly phoneNumberTypeIsUnsupported: boolean;
}

export const DefaultPhoneNumberLoginState: IPhoneNumberLoginState = {
  phoneNumber: undefined,
  phoneNumberTypeIsUnsupported: false,
};

export const phoneNumberLoginReducer: Reducer<
  IPhoneNumberLoginState,
  PhoneNumberLoginActionsType
> = (
  state: IPhoneNumberLoginState = DefaultPhoneNumberLoginState,
  action: PhoneNumberLoginActionsType
) => {
  switch (action.type) {
    case PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER:
      return { ...state, phoneNumber: action.payload.phoneNumber };
    case PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED: {
      return {
        ...state,
        phoneNumberTypeIsUnsupported:
          action.payload.phoneNumberTypeIsUnsupported,
      };
    }
  }

  return state;
};
