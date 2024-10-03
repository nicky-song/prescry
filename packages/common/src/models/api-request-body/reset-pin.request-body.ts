// Copyright 2021 Prescryptive Health, Inc.

import { VerificationTypes } from './send-verification-code.request-body';

export interface IResetPinRequestBody {
  verificationType: VerificationTypes;
  maskedValue: string;
  code: string;
}
