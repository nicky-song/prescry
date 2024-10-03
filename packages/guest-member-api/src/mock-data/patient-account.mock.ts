// Copyright 2022 Prescryptive Health, Inc.

import { mockPatientWithEmail } from './fhir-patient.mock';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';

export const patientAccountPrimaryMock: IPatientAccount = {
  accountType: 'myrx',
  authentication: {
    metadata: {
      PIN: [
        {
          key: 'account-key',
          value: 'pin-hash',
          expiresOn: '2022-09-13T09:40:45.276Z',
          verifiedOn: '2022-09-13T09:40:45.276Z',
        },
      ],
    },
  },
  source: 'myrx',
  roles: [],
  reference: ['phone-hash', 'cash-member-id', 'sie-member-id'],
  patientProfile: 'https://gears.prescryptive.io/patient/patient-id',
  createdOn: '2022-01-01',
  updatedOn: '2022-08-01',
  accountId: 'account-id1',
  status: { state: 'VERIFIED', lastStateUpdate: '2022-10-04' },
};

export const patientAccountPrimaryWithPatientMock: IPatientAccount = {
  accountType: 'myrx',
  authentication: {
    metadata: {
      PIN: [
        {
          key: 'account-key',
          value: 'pin-hash',
          expiresOn: '2022-09-13T09:40:45.276Z',
          verifiedOn: '2022-09-13T09:40:45.276Z',
        },
      ],
    },
  },
  source: 'myrx',
  roles: [],
  patientProfile: 'https://gears.prescryptive.io/patient/patient-id',
  reference: ['phone-hash', 'cash-member-id', 'sie-member-id'],
  createdOn: '2022-01-01',
  updatedOn: '2022-08-01',
  status: { state: 'VERIFIED', lastStateUpdate: '2022-10-04' },
  accountId: 'account-id1',
  patient: mockPatientWithEmail,
};

export const patientAccountPrimaryWithUnverifiedMock: IPatientAccount = {
  accountType: 'myrx',
  authentication: {
    metadata: {},
  },
  source: 'myrx',
  roles: [],
  reference: ['phone-hash', 'cash-member-id', 'sie-member-id'],
  patientProfile: 'https://gears.prescryptive.io/patient/patient-id',
  createdOn: '2022-01-01',
  updatedOn: '2022-08-01',
  accountId: 'account-id1',
  status: { state: 'UNVERIFIED', lastStateUpdate: '2022-10-04' },
};

export const patientAccountPrimaryWithOutAuthMock: IPatientAccount = {
  accountType: 'myrx',
  authentication: {
    metadata: {},
  },
  source: 'myrx',
  roles: [],
  reference: ['phone-hash', 'cash-member-id'],
  patientProfile: 'https://gears.prescryptive.io/patient/patient-id',
  createdOn: '2022-01-01',
  updatedOn: '2022-08-01',
  accountId: 'account-id1',
  status: { state: 'VERIFIED', lastStateUpdate: '2022-10-04' },
};

export const patientAccountPrimaryWithPreferencesMock: IPatientAccount = {
  accountType: 'myrx',
  authentication: {
    metadata: {
      PIN: [
        {
          key: 'account-key',
          value: 'pin-hash',
          expiresOn: '2022-09-13T09:40:45.276Z',
          verifiedOn: '2022-09-13T09:40:45.276Z',
        },
      ],
    },
  },
  source: 'myrx',
  roles: [],
  reference: ['phone-hash', 'cash-member-id', 'sie-member-id'],
  patientProfile: 'https://gears.prescryptive.io/patient/patient-id',
  createdOn: '2022-01-01',
  updatedOn: '2022-08-01',
  accountId: 'account-id1',
  status: { state: 'VERIFIED', lastStateUpdate: '2022-10-04' },
  userPreferences: { favorites: [], features: [], notifications: [] },
};
