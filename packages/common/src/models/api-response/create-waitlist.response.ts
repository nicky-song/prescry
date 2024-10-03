// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type ICreateWaitlistResponse = IApiDataResponse<ICreateWaitlistData>;

export interface ICreateWaitlistData {
  identifier: string;
  phoneNumber: string;
  serviceType: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zipCode: string;
  maxMilesAway: number;
  serviceName: string;
}
