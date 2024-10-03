// Copyright 2021 Prescryptive Health, Inc.

export interface IWaitList {
  identifier: string;
  phoneNumber: string;
  serviceType: string;
  location?: string;
  status?: string;
  invitation?: IPharmacyInvitation;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zipCode?: string;
  maxMilesAway?: number;
  addedBy?: string;
}

export interface IPharmacyInvitation {
  start: string;
  end: string;
}
