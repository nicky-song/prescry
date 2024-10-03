// Copyright 2023 Prescryptive Health, Inc.

import { type Patient } from 'fhir/r4';

export const pbmPatientTemplate: Patient = {
  resourceType: 'Patient',
  active: true,
  identifier: [
    {
      type: {
        coding: [
          {
            code: 'MB',
          },
        ],
        text: 'uniqueId',
      },
      value: '', //PrimaryMemberRxId
    },
  ],
  name: [
    {
      family: '', //Last name
      given: [
        '', //First name
      ],
    },
  ],
  telecom: [
    {
      system: 'phone',
      value: '0000000015', //Optional
      use: 'home',
    },
  ],
  gender: 'unknown', //female/male/other
  birthDate: '', 
  address: [
    {
      line: ['MEMBER15ADD1'],
      city: 'MEMBER15CITY',
      state: 'WA',
      postalCode: '98052',
    },
  ],
};
