// Copyright 2021 Prescryptive Health, Inc.

export interface ICreateWaitListRequest {
  phoneNumber: string;
  serviceType: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zipCode: string;
  maxMilesAway: number;
  addedBy?: string;
}
