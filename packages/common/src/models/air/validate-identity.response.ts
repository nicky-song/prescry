// Copyright 2023 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export interface IValidateIdentity {
  success: boolean;
  error: string;
}

export type IValidateIdentityResponse = IApiDataResponse<IValidateIdentity>;
