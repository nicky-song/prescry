// Copyright 2023 Prescryptive Health, Inc.

import {type Coverage } from 'fhir/r4';

export const coverageTemplate: Coverage = {
  resourceType: 'Coverage',
  identifier: [
    {
      type: {
        coding: [
          {
            code: 'MB',
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          },
        ],
        text: 'Member Number',
      },
      value: '', //Unique ID : primaryMemberRxID
      system: 'https://prescryptive.io/memberidentifier',
    },
    {
      type: {
        coding: [
          {
            code: 'masterId',
          },
        ],
        text: 'Master Id',
      },
      value: '', //MasterId
    },
  ],
  status: 'active',
  type: {
    coding: [
      {
        code: 'family',
        display: 'CoverageType',
      },
    ],
  },
  subscriberId: '', //FamilyId
  subscriber: {
    reference: '',
    type: 'Patient',
  },
  beneficiary: {
    reference: '',
    type: 'Patient',
  },
  dependent: '01', //Person code
  relationship: {
    coding: [
      {
        code: 'self',
      },
    ],
  },
  period: {
    start: '2022-06-01',
  },
  payor: [
    {
      reference: 'Organization/CONFLUENCE', // TINBBG9B (Confluence) OR TINBBF10 (Redirect)
    },
  ],
  class: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'group',
          },
        ],
      },
      value: '1002G52', //group or rxgroup
    },
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'subgroup',
          },
        ],
      },
      value: 'CON03', //rxSubgroup or subGroup
      name: 'Department',
    },
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'rxpcn',
          },
        ],
      },
      value: 'PH',
    },
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'rxbin',
          },
        ],
      },
      value: '610749',
      name: 'RxBin',
    },
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'rxgroup',
          },
        ],
      },
      value: '1002G52', //group or rxgroup
    },
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'rxsubgroup',
          },
        ],
      },
      value: 'CON03', //rxSubgroup or subGroup
    },
    {
      type: {
        coding: [
          {
            system: 'http://prescryptive.io/family',
            code: 'familyid',
          },
        ],
      },
      value: '', //familyid
    },
  ],
};
