// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionPriceEvent } from '../../../models/prescription-price-event';

export const mockPrescriptionPrice: IPrescriptionPriceEvent = {
  identifiers: [
    { type: 'primaryMemberRxId', value: 'member-id' },
    {
      type: 'accountIdentifier',
      value: 'fake-account-id',
    },
  ],
  createdOn: 1590954515,
  createdBy: 'rxassistant-api',
  tags: ['member-id'],
  eventType: 'prescription/price',
  eventData: {
    prescriptionId: 'prescription-id',
    memberId: 'member-id',
    daysSupply: 30,
    pharmacyId: 'pharmacy-id',
    fillDate: new Date().toISOString(),
    ndc: '00023530101',
    planPays: 20,
    memberPays: 10,
    pharmacyTotalPrice: 30,
    quantity: 30,
    type: 'prescription',
  },
};

export const mockPrescriptionPriceTest: IPrescriptionPriceEvent = {
  identifiers: [
    { type: 'primaryMemberRxId', value: 'member-id' },
    {
      type: 'accountIdentifier',
      value: 'fake-account-id',
    },
  ],
  createdOn: 1590954515,
  createdBy: 'rxassistant-api',
  tags: ['member-id'],
  eventType: 'prescription/price',
  eventData: {
    prescriptionId: 'prescription-id',
    memberId: 'member-id',
    daysSupply: 30,
    pharmacyId: 'pharmacy-id',
    fillDate: '2000-01-01T00:00:00.000Z',
    ndc: '00023530101',
    planPays: 2,
    memberPays: 1,
    pharmacyTotalPrice: 3,
    quantity: 60,
    type: 'transferRequest',
  },
};

export const mockPrescriptionPriceNoMatch: IPrescriptionPriceEvent = {
  identifiers: [
    { type: 'primaryMemberRxId', value: 'member-id' },
    {
      type: 'accountIdentifier',
      value: 'fake-account-id',
    },
  ],
  createdOn: 1590954515,
  createdBy: 'rxassistant-api',
  tags: ['member-id'],
  eventType: 'prescription/price',
  eventData: {
    prescriptionId: 'prescription-id',
    memberId: 'member-id',
    daysSupply: 60,
    pharmacyId: 'pharmacy-id',
    fillDate: '2000-01-01T00:00:00.000Z',
    ndc: '00023530101',
    planPays: 2,
    memberPays: 1,
    pharmacyTotalPrice: 3,
    quantity: 60,
    type: 'transferRequest',
  },
};
