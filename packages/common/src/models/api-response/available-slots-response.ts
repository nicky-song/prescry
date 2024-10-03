// Copyright 2020 Prescryptive Health, Inc.

import { IApiDataResponse } from '../api-response';

export type IAvailableSlotsResponse = IApiDataResponse<IAvailableSlotsData>;

export interface IAvailableSlotsData {
  slots: IAvailableSlot[];
  unAvailableDays: string[];
}

export interface IAvailableSlot {
  start: string;
  slotName: string;
  day: string;
}
