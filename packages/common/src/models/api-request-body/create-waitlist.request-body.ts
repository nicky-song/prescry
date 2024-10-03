// Copyright 2021 Prescryptive Health, Inc.

export interface ICreateWaitlistRequestBody {
  serviceType: string;
  zipCode: string;
  maxMilesAway: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  dependentIdentifier?: string;
  myself?: boolean;
}
