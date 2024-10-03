// Copyright 2020 Prescryptive Health, Inc.

export enum PhoneNumberVerificationActionsKeys {
  SET_VERIFICATION_CODE = 'SET_VERIFICATION_CODE',
  SET_SEND_ONE_TIME_PASSWORD_STATUS = 'SET_SEND_ONE_TIME_PASSWORD_STATUS',
  SET_VERIFICATION_CODE_ERROR_STATE = 'SET_VERIFICATION_CODE_ERROR_STATE',
  RESET_VERIFICATION_STATE = 'RESET_VERIFICATION_STATE',
}

export type PhoneNumberVerificationActionsType =
  | ISetVerificationCodeAction
  | ISetOneTimePasswordStatusAction
  | ISetVerificationCodeErrorStateAction
  | IResetPhoneNumberVerificationAction;

export interface IResetPhoneNumberVerificationAction {
  type: PhoneNumberVerificationActionsKeys.RESET_VERIFICATION_STATE;
}

export interface ISetVerificationCodeAction {
  type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE;
  payload: {
    verificationCode: string | undefined;
  };
}

export interface ISetVerificationCodeErrorStateAction {
  type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE_ERROR_STATE;
  payload: {
    isIncorrectCode: boolean;
  };
}

export interface ISetOneTimePasswordStatusAction {
  type: PhoneNumberVerificationActionsKeys.SET_SEND_ONE_TIME_PASSWORD_STATUS;
  payload: {
    isOneTimePasswordSent: boolean;
  };
}

export const resetPhoneNumberVerificationAction =
  (): IResetPhoneNumberVerificationAction => {
    return {
      type: PhoneNumberVerificationActionsKeys.RESET_VERIFICATION_STATE,
    };
  };

export const onVerifyPhoneNumberAction = (
  inputValue: string | undefined
): ISetVerificationCodeAction => {
  return {
    payload: {
      verificationCode: inputValue,
    },
    type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
  };
};
