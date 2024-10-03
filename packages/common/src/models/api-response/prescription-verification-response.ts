// Copyright 2022 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IPrescriptionVerificationResponse = IApiDataResponse<
  IPrescriptionVerificationResponseData
>;

export interface IPrescriptionVerificationResponseData {
  phoneNumber: string;
}
