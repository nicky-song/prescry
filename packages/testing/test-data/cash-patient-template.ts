// Copyright 2023 Prescryptive Health, Inc.

import { type Patient } from 'fhir/r4';

export const cashPatientTemplate: Patient = {
  resourceType: 'Patient',
  id: '', // PIUEUT42
  meta: {
    versionId: '3',
    lastUpdated: '2023-03-08T13:23:28.311668+00:00',
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'MRNCXL8D',
        display: 'MRNCXL8D',
      },
    ],
  },
  identifier: [
    {
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
            code: 'MYRX-PHONE',
            display: "Patient's MyRx Phone Number",
          },
        ],
      },
      value: '', // +14252875340
    },
    {
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
            code: 'MYRX',
            display: 'Unique MyRx ID',
          },
        ],
      },
      value: '', // CAHU6U01
    },
    {
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
            code: 'CASH-FAMILY',
            display: "Patient's Cash Family Id",
          },
        ],
      },
      value: '', // CAHU6U
    },
  ],
  active: true,
  name: [
    {
      use: 'official',
      family: '',
      given: [
        ''
      ]
    }
  ],
  telecom: [
    {
      system: 'email',
      value: '', // testing@prescryptive.com
      use: 'home',
    },
    {
      system: 'phone',
      value: '', // +14252875335
      use: 'mobile',
    }
  ],
  gender: 'other',
  birthDate: '1990-01-01',
  address: [
    {
      use: 'home',
      type: 'physical',
      line: [
        'AVONDALE WAY'
      ],
      city: 'REDMOND',
      state: 'WA',
      postalCode: '98052'
    }
  ],
  communication: [
    {
      language: {
        coding: [
          {
            system: 'urn:ietf:bcp:47',
            code: 'en'
          }
        ],
        text: 'English'
      },
      preferred: true,
    },
  ],
};
