// Copyright 2020 Prescryptive Health, Inc.

export interface IAccountTokenPayload {
  identifier: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  exp?: number;
  membershipIdentifiers?: string[];
}

export interface IAccountTokenPayloadV2 {
  patientAccountId: string;
  cashMasterId?: string;
  phoneNumber: string;
  exp?: number;
}
