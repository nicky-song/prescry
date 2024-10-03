// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'redux';
import { ISetIdentityVerificationDataAction } from './actions/set-identity-verification-data.action';
import { ISetIdentityVerificationEmailFlagAction } from './actions/set-identity-verification-email-flag.action';
import { ISetIdentityVerificationMethodAction } from './actions/set-identity-verification-method.action';

import { ISetIdentityVerificationCodeSentAction } from './actions/set-identity-verification-code-sent.action';
import { IResetIdentityVerificationCodeSentAction } from './actions/reset-identity-verification-code-sent.action';

export interface IIdentityVerificationState {
  readonly recoveryEmailExists?: boolean;
  readonly maskedEmail?: string;
  readonly maskedPhoneNumber?: string;
  readonly selectedVerificationMethod?: string;
  readonly verificationAttemptsUsed?: number;
  readonly isVerificationCodeSent?: boolean;
}

export const defaultIdentityVerificationState: IIdentityVerificationState = {};

export type IIdentityVerificationActionTypes =
  | ISetIdentityVerificationEmailFlagAction
  | ISetIdentityVerificationDataAction
  | ISetIdentityVerificationMethodAction
  | ISetIdentityVerificationCodeSentAction
  | IResetIdentityVerificationCodeSentAction;

export const identityVerificationReducer: Reducer<
  IIdentityVerificationState,
  IIdentityVerificationActionTypes
> = (
  state: IIdentityVerificationState = defaultIdentityVerificationState,
  action: IIdentityVerificationActionTypes
): IIdentityVerificationState => {
  switch (action.type) {
    case 'SET_IDENTITY_VERIFICATION_EMAIL_FLAG':
      return {
        ...state,
        recoveryEmailExists: action.payload.recoveryEmailExists,
      };
    case 'SET_IDENTITY_VERIFICATION_DATA':
      return {
        ...state,
        maskedEmail: action.payload.maskedEmail,
        maskedPhoneNumber: action.payload.maskedPhoneNumber,
      };
    case 'SET_IDENTITY_VERIFICATION_METHOD':
      return {
        ...state,
        selectedVerificationMethod: action.payload.selectedVerificationMethod,
      };
    case 'SET_IDENTITY_VERIFICATION_CODE_SENT':
      return {
        ...state,
        isVerificationCodeSent: action.payload.isVerificationCodeSent,
      };

    case 'RESET_IDENTITY_VERIFICATION_CODE_SENT':
      return {
        ...state,
        isVerificationCodeSent: undefined,
      };
    default:
      return state;
  }
};
