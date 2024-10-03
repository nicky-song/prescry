// Copyright 2021 Prescryptive Health, Inc.

import { IIdentityVerificationAction } from './identity-verification.action';

export interface ISetIdentityVerificationMethodActionPayload {
  selectedVerificationMethod: string;
}
export type ISetIdentityVerificationMethodAction = IIdentityVerificationAction<
  'SET_IDENTITY_VERIFICATION_METHOD',
  ISetIdentityVerificationMethodActionPayload
>;

export const setIdentityVerificationMethodAction = (
  data: ISetIdentityVerificationMethodActionPayload
): ISetIdentityVerificationMethodAction => ({
  payload: data,
  type: 'SET_IDENTITY_VERIFICATION_METHOD',
});
