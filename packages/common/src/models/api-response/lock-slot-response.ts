// Copyright 2021 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type ILockSlotResponse = IApiDataResponse<ILockSlotResponseData>;

export interface ILockSlotResponseData {
  bookingId: string;
  slotExpirationDate: Date;
}
