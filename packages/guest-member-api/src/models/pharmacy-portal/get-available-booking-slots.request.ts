// Copyright 2021 Prescryptive Health, Inc.

export interface IGetAvailableBookingSlotsRequest {
  locationId: string;
  start: string;
  end: string;
  serviceType: string;
}
