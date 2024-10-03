// Copyright 2021 Prescryptive Health, Inc.

export interface ICreateWaitlist {
  identifier: string;
  phoneNumber: string;
  serviceType: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zipCode: string;
  maxMilesAway: number;
}
export interface ICreateWaitlistEndpointResponse {
  waitlist?: ICreateWaitlist;
  errorCode?: number;
  message: string;
}
