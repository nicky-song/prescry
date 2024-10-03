// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../models/pharmacy';
import { IPrescriptionInfo } from '../../../models/prescription-info';

export const prescriptionInfoMock: IPrescriptionInfo = {
  drugName: 'drug-name',
  ndc: '12345',
  form: 'form',
  organizationId: 'organization-id',
  prescriptionId: 'prescription-id',
  primaryMemberRxId: 'SIECA7F7K01',
  refills: 1,
  strength: '2',
  quantity: 3,
  unit: 'unit',
  zipCode: 'zip-code',
  practitioner: {
    id: 'practitioner-id',
    name: 'practitioner',
    phoneNumber: '000-000-0000',
  },
  pharmacy: {
    name: 'pharmacy',
    address: {
      lineOne: 'pharmacy-line-one',
      lineTwo: 'pharmacy-line-two',
      city: 'pharmacy-city',
      state: 'pharmacy-state',
      zip: 'pharmacy-zip',
    },
    phoneNumber: '000-000-0000',
    hours: [],
    twentyFourHours: true,
    ncpdp: 'pharmacy-ncpcp',
    isMailOrderOnly: false,
  },
  orderDate: new Date(),
  orderNumber: 'order-number',
};

export const prescriptionInfoWithoutPharmacyMock: IPrescriptionInfo = {
  drugName: 'drug-name',
  ndc: '12345',
  form: 'form',
  organizationId: 'organization-id',
  prescriptionId: 'prescription-id',
  primaryMemberRxId: 'primary-member-rx-id',
  refills: 1,
  strength: '2',
  quantity: 3,
  unit: 'unit',
  zipCode: 'zip-code',
  practitioner: {
    id: 'practitioner-id',
    name: 'practitioner',
    phoneNumber: '000-000-0000',
  },
  orderDate: new Date(),
  orderNumber: 'order-number',
};

export const prescriptionInfoUntrimmedMock: IPrescriptionInfo = {
  ...prescriptionInfoMock,
  pharmacy: {
    ...(prescriptionInfoMock.pharmacy as IPharmacy),
    name: `  ${prescriptionInfoMock.pharmacy?.name}  `,
    address: {
      lineOne: ` ${prescriptionInfoMock.pharmacy?.address.lineOne}  `,
      lineTwo: ` ${prescriptionInfoMock.pharmacy?.address.lineTwo}  `,
      city: ` ${prescriptionInfoMock.pharmacy?.address.city}  `,
      state: ` ${prescriptionInfoMock.pharmacy?.address.state}  `,
      zip: ` ${prescriptionInfoMock.pharmacy?.address.zip}  `,
    },
    phoneNumber: ` ${prescriptionInfoMock.pharmacy?.phoneNumber}  `,
  },
};
