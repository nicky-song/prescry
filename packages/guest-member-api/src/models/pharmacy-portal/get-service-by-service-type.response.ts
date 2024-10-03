// Copyright 2021 Prescryptive Health, Inc.

import { IServices } from '../services';

export interface IServiceTypeDetailsResponse {
  service?: IServices;
  message: string;
  errorCode?: number;
}
