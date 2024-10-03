// Copyright 2020 Prescryptive Health, Inc.

export interface IAvailableSlotsRequestBody {
  locationId: string;
  serviceType: string;
  start: string;
  end: string;
}
