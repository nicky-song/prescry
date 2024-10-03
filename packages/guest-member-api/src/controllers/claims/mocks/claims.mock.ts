// Copyright 2022 Prescryptive Health, Inc.

import { IClaim } from '@phx/common/src/models/claim';
import { IClaimsResponse } from '../../../utils/external-api/claims/get-claims';

export const claim1Mock: IClaim = {
  prescriptionId: 'mock-prescription-id-1',
  drugName: 'drug-name-1',
  ndc: '12345',
  formCode: 'TABS',
  strength: '100mg',
  quantity: 10,
  daysSupply: 11,
  refills: 1,
  orderNumber: '112233',
  practitioner: {
    id: 'practitioner-1',
    name: 'Dr. One',
    phoneNumber: '1111111111',
  },
  pharmacy: {
    name: 'Rx Pharmacy 1',
    ncpdp: '1',
    phoneNumber: '5098397030',
  },
  filledOn: new Date(),
  billing: {
    memberPays: 1.86,
    deductibleApplied: 1.86,
  },
};

export const claim2Mock: IClaim = {
  prescriptionId: 'mock-prescription-id-2',
  drugName: 'drug-name-2',
  ndc: '23456',
  formCode: 'CAPS',
  strength: '20g',
  daysSupply: 20,
  quantity: 22,
  refills: 2,
  orderNumber: '223344',
  practitioner: {
    id: 'practitioner-2',
    name: 'Dr. Two',
    phoneNumber: '2222222222',
  },
  pharmacy: {
    name: 'Rx Pharmacy 2',
    ncpdp: '2',
    phoneNumber: '1098397030',
  },
  filledOn: new Date(),
  billing: {
    memberPays: 10,
    deductibleApplied: 0,
  },
};

export const claimsResponseMock: IClaimsResponse = {
  memberId: 'PB12456789001',
  claimData: [
    {
      id: '17266a667ggtf222',
      billing: {
        individualDeductibleAmount: 1,
        individualMemberAmount: 5,
      },
      claim: {
        dateProcessed: '2022-05-27',
        drugName: 'ALBUTEROL SULFATE HFA',
        drugNDC: '66993001968',
        formCode: '3',
        strength: '90 MCG',
        quantity: 0,
        refills: 0,
        daysSupply: 17,
      },
      pharmacy: {
        ncpdp: '4923769',
        name: 'WALMART PHARMACY #102241',
        phoneNumber: '5298397030',
      },
      practitioner: {
        id: '1902138860',
        name: 'REDD, JASON D PA-C',
        phoneNumber: '5098370070',
      },
    },
  ],
};
