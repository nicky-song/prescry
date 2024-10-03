// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export interface IPrescriptionUserStatusResponseData {
  personExists: boolean;
}

export type IPrescriptionUserStatusResponse = IApiDataResponse<
  IPrescriptionUserStatusResponseData
>;
