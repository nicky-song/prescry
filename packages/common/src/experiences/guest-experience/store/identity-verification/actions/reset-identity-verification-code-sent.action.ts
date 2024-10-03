// Copyright 2021 Prescryptive Health, Inc.

import { IIdentityVerificationAction } from './identity-verification.action';

export type IResetIdentityVerificationCodeSentAction =
  IIdentityVerificationAction<
    'RESET_IDENTITY_VERIFICATION_CODE_SENT',
    undefined
  >;

export const resetIdentityVerificationCodeSentAction =
  (): IResetIdentityVerificationCodeSentAction => ({
    payload: undefined,
    type: 'RESET_IDENTITY_VERIFICATION_CODE_SENT',
  });
