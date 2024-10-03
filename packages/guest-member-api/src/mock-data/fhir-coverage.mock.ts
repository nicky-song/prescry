// Copyright 2022 Prescryptive Health, Inc.

import { ICoverage } from '../models/fhir/patient-coverage/coverage';
import { configurationMock } from './configuration.mock';

export const cashCoveragePrimaryMock: ICoverage = {
  resourceType: 'Coverage',
  id: 'some-guid',
  meta: {
    versionId: '1',
    lastUpdated: '2021-10-29T20:11:52.769+00:00',
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  identifier: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MB',
          },
        ],
      },
      system: 'https://prescryptive.io/memberidentifier',
      value: 'member-id',
    },
    {
      type: {
        coding: [
          {
            code: 'hash',
          },
        ],
        text: 'Hash value',
      },
      value: 'hash-value',
    },
  ],
  status: 'active',
  type: {
    coding: [
      {
        code: 'individual',
        display: 'CoverageType',
      },
    ],
  },
  subscriber: {
    reference: 'https://prescryptive.io/identity/patient/primary-patient-guid',
  },
  subscriberId: 'CADX4O01',
  beneficiary: {
    reference: 'https://prescryptive.io/identity/patient/primary-patient-guid',
  },
  dependent: '01',
  relationship: {
    coding: [
      {
        code: 'self',
      },
    ],
  },
  period: {
    start: '2021-10-29',
  },
  payor: [
    {
      reference:
        'https://prescryptive.io/identity/patient/primary-patient-guid',
    },
  ],
  class: [
    {
      type: {
        coding: [
          {
            system: 'http://prescryptive.io/family',
            code: 'familyid',
          },
        ],
      },
      value: 'family-id',
      name: 'FamilyId',
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
      value: '200P32F',
      name: 'Group',
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
      value: 'CASH01',
      name: 'SubGroup',
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
            code: 'rxpcn',
          },
        ],
      },
      value: 'X01',
      name: 'RxPCN',
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
      value: 'family-id',
      name: 'FamilyId',
    },
  ],
};

export const cashCoverageDependentMock: ICoverage = {
  resourceType: 'Coverage',
  id: 'some-guid-dependent',
  meta: {
    versionId: '1',
    lastUpdated: '2021-10-29T20:11:52.769+00:00',
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'tenant-id',
        display: 'Tenant identifier',
      },
    ],
  },
  identifier: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MB',
          },
        ],
      },
      system: 'https://prescryptive.io/memberidentifier',
      value: 'CADX4O03',
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
  subscriber: {
    reference: 'https://prescryptive.io/identity/patient/primary-patient-guid',
  },
  subscriberId: 'CADX4O01',
  beneficiary: {
    reference:
      'https://prescryptive.io/identity/patient/dependent-patient-guid',
  },
  dependent: '03',
  relationship: {
    coding: [
      {
        code: 'other',
      },
    ],
  },
  period: {
    start: '2021-10-29',
  },
  payor: [
    {
      reference:
        'https://prescryptive.io/identity/patient/primary-patient-guid',
    },
  ],
  class: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'rxgroup',
          },
        ],
      },
      value: '200P32F',
      name: 'Group',
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
      value: 'CASH01',
      name: 'SubGroup',
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
            code: 'rxpcn',
          },
        ],
      },
      value: 'X01',
      name: 'RxPCN',
    },
  ],
};

export const cancelledCoverageMock: ICoverage = {
  resourceType: 'Coverage',
  id: 'some-guid',
  meta: {
    versionId: '1',
    lastUpdated: '2021-10-29T20:11:52.769+00:00',
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'tenant-id',
        display: 'Tenant identifier',
      },
    ],
  },
  identifier: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MB',
          },
        ],
      },
      system: 'https://prescryptive.io/memberidentifier',
      value: 'CADX4O01',
    },
  ],
  status: 'cancelled',
  type: {
    coding: [
      {
        code: 'individual',
        display: 'CoverageType',
      },
    ],
  },
  subscriber: {
    reference: 'https://prescryptive.io/identity/patient/primary-patient-guid',
  },
  subscriberId: 'CADX4O01',
  beneficiary: {
    reference: 'https://prescryptive.io/identity/patient/primary-patient-guid',
  },
  dependent: '01',
  relationship: {
    coding: [
      {
        code: 'self',
      },
    ],
  },
  period: {
    start: '2020-10-29',
    end: '2021-12-31',
  },
  payor: [
    {
      reference:
        'https://prescryptive.io/identity/patient/primary-patient-guid',
    },
  ],
  class: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/coverage-class',
            code: 'rxgroup',
          },
        ],
      },
      value: '200P32F',
      name: 'Group',
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
      value: 'CASH01',
      name: 'SubGroup',
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
            code: 'rxpcn',
          },
        ],
      },
      value: 'X01',
      name: 'RxPCN',
    },
  ],
};

export const coverageMock1: Partial<ICoverage> = {
  resourceType: 'Coverage',
  id: 'coverage-id1',
  beneficiary: {
    reference: 'https://prescryptive.io/identity/patient/MASTER-ID-MOCK',
  },
  period: {
    start: '2022-01-01',
    end: '2023-03-01',
  },
  subscriber: {
    reference: 'https://prescryptive.io/identity/patient/MASTER-ID-MOCK',
  },
  subscriberId: 'family-id',
  dependent: '01',
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'tenant1',
      },
    ],
  },
};

export const coverageMock2: Partial<ICoverage> = {
  resourceType: 'Coverage',
  id: 'MOCK-ID',
  beneficiary: {
    reference: 'https://prescryptive.io/identity/patient/MASTER-ID-MOCK',
  },
  period: {
    start: '2022-03-01',
    end: '2022-05-01',
  },
  identifier: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MB',
          },
        ],
      },
      system: 'https://prescryptive.io/memberidentifier',
      value: 'member-id',
    },
  ],
  subscriberId: 'family-id',
  dependent: '03',
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'tenant2',
      },
    ],
  },
};

export const coverageMock2Tenant2: Partial<ICoverage> = {
  resourceType: 'Coverage',
  id: 'MOCK-ID2',
  beneficiary: {
    reference: 'https://prescryptive.io/identity/patient/MASTER-ID-MOCK',
  },
  period: {
    start: '2022-03-01',
    end: '2022-05-01',
  },
  identifier: [
    {
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'MB',
          },
        ],
      },
      system: 'https://prescryptive.io/memberidentifier',
      value: 'member-id2',
    },
  ],
  subscriberId: 'family-id',
  dependent: '03',
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'tenant4',
      },
    ],
  },
};
