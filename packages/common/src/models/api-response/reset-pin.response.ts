// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IResetPinResponse = IApiDataResponse<IResetPinResponseData>;

export interface IResetPinResponseData {
  deviceToken: string;
}
