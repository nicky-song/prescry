// Copyright 2021 Prescryptive Health, Inc.

import { IIdentityVerificationAction } from './identity-verification.action';

export interface ISetIdentityVerificationDataActionPayload {
  maskedEmail?: string;
  maskedPhoneNumber?: string;
}
export type ISetIdentityVerificationDataAction = IIdentityVerificationAction<
  'SET_IDENTITY_VERIFICATION_DATA',
  ISetIdentityVerificationDataActionPayload
>;

export const setIdentityVerificationDataAction = (
  data: ISetIdentityVerificationDataActionPayload
): ISetIdentityVerificationDataAction => ({
  payload: data,
  type: 'SET_IDENTITY_VERIFICATION_DATA',
});
