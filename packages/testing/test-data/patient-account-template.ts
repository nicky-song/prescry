// Copyright 2023 Prescryptive Health, Inc.

import { PatientAccount } from '../types';

export const patientAccountTemplate: PatientAccount = {
  schemaVersion: '1.0',
  accountId: '', //'PIUT6Q1F',
  patientId: '', //'PIUT6Q1F',
  vaultUri: 'https://keyvault-patientagent-qa.vault.azure.net/',
  createdOn: '2023-03-03T00:17:33.128Z',
  updatedOn: '2023-03-03T00:17:46.31Z',
  lastContactTime: null,
  revision: 3,
  patient: null,
  prescriptionToId: {},
  idToPrescription: {},
  accountType: 'myrx',
  source: 'myrx',
  status: {
    lastStateUpdate: '2023-03-03T00:17:46.31Z',
    state: 'VERIFIED',
  },
  patientProfile: '', //'patient/PIUT6Q1F',
  identityVerified: null,
  authentication: {
    metadata: {
      PIN: [
        {
          expiresOn: null,
          verifiedOn: null,
          key: '$2a$10$N3.3w/bPulT.UjLYcCxrO.',
          value: '$2a$10$VrNQz5S2KhXW9ouVNFsDQelIOS5a46cxqXZcqVlV7zCbTOMcRgDnO',
        },
      ],
    },
  },
  reference: [],
  termsAndConditions: {
    hasAccepted: true,
    allowSmsMessages: true,
    allowEmailMessages: true,
    fromIP: '::ffff:147.243.162.9',
    acceptedDateTime: '2023-03-03T00:17:46.31Z',
    browser:
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.38 Mobile Safari/537.36',
    authToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2UiOiJLekUwTWpVeU9EYzFNelF3IiwiZGV2aWNlSWRlbnRpZmllciI6IjYzZDFhNzc0MjY3Mzc3ZjViY2YwNWQwMSIsImRldmljZUtleSI6IiQyYSQxMCROMy4zdy9iUHVsVC5VakxZY0N4ck8uIiwiZGV2aWNlVHlwZSI6InBob25lIiwiaWF0IjoxNjc0Njg0Mjc2LCJleHAiOjE3MDYyMjAyNzZ9.t2vGOXJpWqWgayQUd5xJAXaC3LNQ9WBNS6-oloJeF8I',
  },
  userPreferences: {
    favorites: [],
    notifications: [],
    features: [],
    language: 'en',
  },
};
