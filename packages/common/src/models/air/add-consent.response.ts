// Copyright 2023 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export interface IAddConsent {
  success: boolean;
  error: string;
}

export type IAddConsentResponse = IApiDataResponse<IAddConsent>;
