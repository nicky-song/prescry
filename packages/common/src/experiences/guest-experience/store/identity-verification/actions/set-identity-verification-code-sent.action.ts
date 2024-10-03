// Copyright 2021 Prescryptive Health, Inc.

import { IIdentityVerificationAction } from './identity-verification.action';

export interface ISetIdentityVerificationCodeSentActionPayload {
  isVerificationCodeSent: boolean;
}
export type ISetIdentityVerificationCodeSentAction =
  IIdentityVerificationAction<
    'SET_IDENTITY_VERIFICATION_CODE_SENT',
    ISetIdentityVerificationCodeSentActionPayload
  >;

export const setIdentityVerificationCodeSentAction = (
  data: ISetIdentityVerificationCodeSentActionPayload
): ISetIdentityVerificationCodeSentAction => ({
  payload: data,
  type: 'SET_IDENTITY_VERIFICATION_CODE_SENT',
});
