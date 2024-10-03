// Copyright 2022 Prescryptive Health, Inc.

import { IPatient } from '../../fhir/patient/patient';
import { IPatientAccountAuthentication } from './properties/patient-account-authentication';
import { IPatientAccountIdentityVerifiedType } from './properties/patient-account-identity-verified';
import { IPatientAccountRole } from './properties/patient-account-role';
import { IPatientAccountStatus } from './properties/patient-account-status';
import { ITermsAndConditionsAcceptance } from './properties/patient-account-terms-and-conditions';
import { IPatientAccountUserPreferences } from './properties/patient-account-user-preferences';

export type PatientAccountType = 'myrx' | 'myrx-test';

export const PATIENT_ACCOUNT_SOURCE_MYRX = 'myrx';

export interface IPatientAccount {
  accountType: PatientAccountType;
  authentication: IPatientAccountAuthentication;
  source: string;
  reference: string[];
  roles: IPatientAccountRole[];
  patientProfile?: string;
  identityVerified?: IPatientAccountIdentityVerifiedType;
  userPreferences?: IPatientAccountUserPreferences;
  vaultUri?: string;
  walletAddressToSCAddress?: Map<string, string>;
  scAddressToWalletAddress?: Map<string, string>;
  patient?: IPatient;
  accountId?: string;
  patientId?: string;
  createdOn?: string;
  updatedOn?: string;
  status?: IPatientAccountStatus;
  termsAndConditions?: ITermsAndConditionsAcceptance;
}

export interface IPatientAccountErrorResponse {
  title?: string;
  error?: string;
  message?: string;
}
