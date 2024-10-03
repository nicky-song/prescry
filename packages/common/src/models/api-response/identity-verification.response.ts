// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IIdentityVerificationResponse =
  IApiDataResponse<IIdentityVerificationData>;

export interface IIdentityVerificationData {
  maskedPhoneNumber: string;
  maskedEmailAddress: string;
}
