// Copyright 2023 Prescryptive Health, Inc.

import { type Patient } from 'fhir/r4';

export class PatientAccount {
  schemaVersion: '1.0';
  accountId?: string;
  patientId?: string;
  reference?: string[];
  vaultUri?: string;
  createdOn?: string;
  updatedOn?: string;
  lastContactTime: null;
  revision: number;
  patient?: Patient| null;
  prescriptionToId: unknown;
  idToPrescription: unknown;
  accountType: 'myrx';
  source: string;
  status?: {lastStateUpdate: string, state: string};
  patientProfile?: string;
  identityVerified?: unknown;
  authentication: unknown;
  termsAndConditions?: unknown;
  userPreferences?: unknown;
}
