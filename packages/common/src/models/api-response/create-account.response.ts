// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type ICreateAccountResponse =
  IApiDataResponse<ICreateAccountResponseData>;

export interface ICreateAccountResponseData {
  deviceToken: string;
  recoveryEmailExists?: boolean;
}
