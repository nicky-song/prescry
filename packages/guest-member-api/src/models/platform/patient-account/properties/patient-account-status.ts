// Copyright 2022 Prescryptive Health, Inc.

export type PatientAccountState = 'VERIFIED' | 'UNVERIFIED';

export interface IPatientAccountStatus {
  state: PatientAccountState;
  lastStateUpdate?: string;
}

export interface IPatientAccountStatusErrorResponse {
  error?: string;
  title?: string;
}
