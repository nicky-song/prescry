// Copyright 2021 Prescryptive Health, Inc.

import { IIdentityVerificationAction } from './identity-verification.action';

export interface ISetIdentityVerificationEmailFlagActionPayload {
  recoveryEmailExists: boolean;
}
export type ISetIdentityVerificationEmailFlagAction =
  IIdentityVerificationAction<
    'SET_IDENTITY_VERIFICATION_EMAIL_FLAG',
    ISetIdentityVerificationEmailFlagActionPayload
  >;

export const setIdentityVerificationEmailFlagAction = (
  data: ISetIdentityVerificationEmailFlagActionPayload
): ISetIdentityVerificationEmailFlagAction => ({
  payload: data,
  type: 'SET_IDENTITY_VERIFICATION_EMAIL_FLAG',
});
