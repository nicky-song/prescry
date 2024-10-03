// Copyright 2018 Prescryptive Health, Inc.

import { Reducer } from 'redux';

import {
  PhoneNumberVerificationActionsKeys,
  PhoneNumberVerificationActionsType,
} from './actions/phone-number-verification.actions';

export interface IPhoneNumberVerificationState {
  verificationCode?: string;
  isIncorrectCode: boolean;
  isOneTimePasswordSent: boolean;
}

export const DefaultPhoneNumberVerificationState: IPhoneNumberVerificationState =
  {
    isIncorrectCode: false,
    isOneTimePasswordSent: false,
    verificationCode: undefined,
  };

export const phoneNumberVerificationReducer: Reducer<
  IPhoneNumberVerificationState,
  PhoneNumberVerificationActionsType
> = (
  state: IPhoneNumberVerificationState = DefaultPhoneNumberVerificationState,
  action: PhoneNumberVerificationActionsType
) => {
  switch (action.type) {
    case PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE:
      return { ...state, verificationCode: action.payload.verificationCode };
    case PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE_ERROR_STATE:
      return { ...state, isIncorrectCode: action.payload.isIncorrectCode };
    case PhoneNumberVerificationActionsKeys.SET_SEND_ONE_TIME_PASSWORD_STATUS:
      return {
        ...state,
        isOneTimePasswordSent: action.payload.isOneTimePasswordSent,
      };
    case PhoneNumberVerificationActionsKeys.RESET_VERIFICATION_STATE:
      return {
        ...DefaultPhoneNumberVerificationState,
      };
  }
  return state;
};
