// Copyright 2022 Prescryptive Health, Inc.

import { IAddress } from '../models/fhir/address';
import { ICoding } from '../models/fhir/coding';
import { IContactPoint } from '../models/fhir/contact-point';
import { IHumanName } from '../models/fhir/human-name';
import { Identifier } from '../models/fhir/identifier';
import {
  IPatient,
  PatientIdentifierCodeableConceptCode,
} from '../models/fhir/patient/patient';

import { IPatientCommunication } from '../models/fhir/patient/patient-communication';
import { configurationMock } from './configuration.mock';

const identifiers = [
  {
    type: {
      coding: [
        {
          system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          code: 'PT',
          display: "Patient's PrimeRx ID",
        } as ICoding,
      ],
    },
    value: 'PRIMERX-ID',
  } as Identifier,
  {
    type: {
      coding: [
        {
          code: 'MYRX-PHONE',
          display: "Patient's MyRx Phone Number",
          system: 'http://hl7.org/fhir/ValueSet/identifier-type',
        },
      ],
    },
    value: '+11234567890',
  },
  {
    type: {
      coding: [
        {
          code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
          display: 'Unique MyRx ID',
          system: 'http://hl7.org/fhir/ValueSet/identifier-type',
        },
      ],
    },
    value: 'member-id',
  },
  {
    type: {
      coding: [
        {
          code: 'CASH-FAMILY',
          display: "Patient's Cash Family Id",
          system: 'http://hl7.org/fhir/ValueSet/identifier-type',
        },
      ],
    },
    value: 'family-id',
  },
];
const communication = [
  {
    language: {
      coding: [
        {
          system: 'urn:ietf:bcp:47',
          code: 'English',
        },
      ],
    },
    preferred: true,
  } as IPatientCommunication,
];
const name = [
  {
    family: 'ALAM',
    given: ['DIAN'],
  } as IHumanName,
];
const address = [
  {
    line: ['6800 Jericho Turnpike'],
    city: 'HICKSVILLE',
    state: 'NY',
    postalCode: '11753',
  } as IAddress,
];
export const mockPatient: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  name: [
    {
      family: 'ALAM',
      given: ['DIAN'],
    } as IHumanName,
  ],
  telecom: [
    {
      system: 'phone',
      value: '9999999999',
      use: 'mobile',
      period: {
        start: '2005-01-01',
        end: '2015-01-01',
      },
    },
    {
      system: 'phone',
      value: '2222222222',
      use: 'home',
    } as IContactPoint,
    {
      system: 'phone',
      value: '1111111111',
      use: 'mobile',
    } as IContactPoint,
    {
      system: 'phone',
      value: '3333333333',
      use: 'work',
    } as IContactPoint,
  ],
  gender: 'male',
  birthDate: '1980-01-01',
  address: [
    {
      line: ['6800 Jericho Turnpike'],
      city: 'HICKSVILLE',
      state: 'NY',
      postalCode: '11753',
    } as IAddress,
  ],
  communication,
};
export const mockPatientWithEmail: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  name,
  telecom: [
    {
      system: 'phone',
      value: '9999999999',
      use: 'mobile',
      period: {
        start: '2005-01-01',
        end: '2015-01-01',
      },
    },
    {
      system: 'phone',
      value: '2222222222',
      use: 'home',
    } as IContactPoint,
    {
      system: 'phone',
      value: '1111111111',
      use: 'mobile',
    } as IContactPoint,
    {
      system: 'phone',
      value: '3333333333',
      use: 'work',
    } as IContactPoint,
    {
      system: 'email',
      use: 'home',
      value: 'email@prescryptive.com',
    },
  ],
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  communication,
};

export const mockPatientNoTelecom: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  name,
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  communication,
};

export const mockPatientOnlyEmail: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  name,
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  telecom: [
    {
      system: 'email',
      use: 'home',
      value: 'test@prescryptive.com',
    },
  ],
  communication,
};
export const mockPatientUpdatedEmail: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  name,
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  telecom: [
    {
      system: 'email',
      use: 'home',
      value: 'testnew@prescryptive.com',
    },
  ],
  communication,
};

export const mockPatientOnlyPhone: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  identifier: identifiers,
  name,
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  telecom: [
    {
      system: 'phone',
      use: 'mobile',
      value: '+12223334444',
    },
  ],
  communication,
};
export const mockPatientEmailAndPhone: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  name,
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  telecom: [
    {
      system: 'phone',
      use: 'mobile',
      value: '+12223334444',
    },
    {
      system: 'email',
      use: 'home',
      value: 'test@prescryptive.com',
    },
  ],
  communication,
};

export const mockPatientEmailAndPhoneUpdated: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id',
  identifier: identifiers,
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: configurationMock.myrxIdentityTenantId,
        display: 'Tenant identifier',
      },
    ],
  },
  name,
  gender: 'male',
  birthDate: '1980-01-01',
  address,
  telecom: [
    {
      system: 'email',
      use: 'home',
      value: 'testnew@prescryptive.com',
    },
    {
      system: 'phone',
      use: 'mobile',
      value: '+12223334444',
    },
  ],
  communication,
};

export const mockPbmPatient: IPatient = {
  resourceType: 'Patient',
  id: 'pbm-patient-id',
  meta: {
    security: [
      {
        system: 'http://prescryptive.io/tenant',
        code: 'T123456',
        display: 'Tenant identifier',
      },
    ],
  },
  identifier: [
    ...identifiers,
    {
      type: {
        coding: [
          {
            code: 'MB',
            display: "Patient's pbm Family Id",
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'member-id',
    },
  ],
  name: [
    {
      family: 'pbm-last',
      given: ['pbm-first'],
    } as IHumanName,
  ],
  gender: 'female',
  birthDate: '2000-01-01',
  address,
  telecom: [
    {
      system: 'email',
      use: 'home',
      value: 'testnew@prescryptive.com',
    },
    {
      system: 'phone',
      use: 'mobile',
      value: '1234567890',
    },
  ],
  communication,
};

export const mockChildDependentPatient: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id2',
  identifier: [
    {
      type: {
        coding: [
          {
            code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
            display: 'Unique MyRx ID',
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'myrx-id-02',
    },
    {
      type: {
        coding: [
          {
            code: 'CASH-FAMILY',
            display: "Patient's Cash Family Id",
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'family-id',
    },
  ],
  name,
  telecom: [
    {
      system: 'phone',
      value: '9999999999',
      use: 'mobile',
      period: {
        start: '2005-01-01',
        end: '2015-01-01',
      },
    },
    {
      system: 'phone',
      value: '2222222222',
      use: 'home',
    } as IContactPoint,
    {
      system: 'phone',
      value: '1111111111',
      use: 'mobile',
    } as IContactPoint,
    {
      system: 'phone',
      value: '3333333333',
      use: 'work',
    } as IContactPoint,
  ],
  gender: 'male',
  birthDate: '2019-01-01',
  address,
  communication,
};
export const mockAdultDependentPatient: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id3',
  identifier: [
    {
      type: {
        coding: [
          {
            code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
            display: 'Unique MyRx ID',
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'myrx-id-03',
    },
    {
      type: {
        coding: [
          {
            code: 'CASH-FAMILY',
            display: "Patient's Cash Family Id",
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'myrx-id',
    },
  ],
  name,
  telecom: [
    {
      system: 'phone',
      value: '9999999999',
      use: 'mobile',
      period: {
        start: '2005-01-01',
        end: '2015-01-01',
      },
    },
    {
      system: 'phone',
      value: '2222222222',
      use: 'home',
    } as IContactPoint,
    {
      system: 'phone',
      value: '1111111111',
      use: 'mobile',
    } as IContactPoint,
    {
      system: 'phone',
      value: '3333333333',
      use: 'work',
    } as IContactPoint,
  ],
  gender: 'male',
  birthDate: '2005-01-01',
  address,
  communication,
};
export const mockChildPbmDependentPatient: IPatient = {
  resourceType: 'Patient',
  id: 'patient-id4',
  identifier: [
    {
      type: {
        coding: [
          {
            code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
            display: 'Unique MyRx ID',
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'myrx-id-04',
    },
    {
      type: {
        coding: [
          {
            code: 'CASH-FAMILY',
            display: "Patient's Cash Family Id",
            system: 'http://hl7.org/fhir/ValueSet/identifier-type',
          },
        ],
      },
      value: 'myrx-id',
    },
  ],
  name,
  telecom: [
    {
      system: 'phone',
      value: '9999999999',
      use: 'mobile',
      period: {
        start: '2005-01-01',
        end: '2015-01-01',
      },
    },
    {
      system: 'phone',
      value: '2222222222',
      use: 'home',
    } as IContactPoint,
    {
      system: 'phone',
      value: '1111111111',
      use: 'mobile',
    } as IContactPoint,
    {
      system: 'phone',
      value: '3333333333',
      use: 'work',
    } as IContactPoint,
  ],
  gender: 'male',
  birthDate: '2020-01-01',
  address,
  communication,
};
