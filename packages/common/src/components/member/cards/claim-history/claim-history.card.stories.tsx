// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ClaimHistoryCard, IClaimHistoryCardProps } from './claim-history.card';
import { IClaim } from '../../../../models/claim';
import { List } from '../../../primitives/list';

export default {
  title: 'Cards/ClaimHistoryCard',
  component: ClaimHistoryCard,
};

const sampleClaim: IClaim = {
  prescriptionId: '',
  drugName: 'Medicine A',
  ndc: '12345',
  formCode: 'TAB',
  strength: '100mg',
  quantity: 20,
  daysSupply: 22,
  refills: 2,
  orderNumber: '112233',
  practitioner: {
    id: 'practitioner-1',
    name: 'Dr. One',
    phoneNumber: '1111111111',
  },
  pharmacy: {
    name: 'Rx Pharmacy 1',
    ncpdp: '1',
    phoneNumber: '2222222222',
  },
  filledOn: new Date(),
  billing: {
    memberPays: 1.86,
    deductibleApplied: 1.86,
  },
};

const ArgsWrapper: Story<IClaimHistoryCardProps> = (args) => (
  <List>
    <ClaimHistoryCard {...args} />
  </List>
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  claim: sampleClaim,
};

export const NoOrderNumber = ArgsWrapper.bind({});
NoOrderNumber.args = {
  claim: { ...sampleClaim, orderNumber: undefined },
};

export const NoPharmacyPhoneNumber = ArgsWrapper.bind({});
NoPharmacyPhoneNumber.args = {
  claim: {
    ...sampleClaim,
    pharmacy: { ...sampleClaim.pharmacy, phoneNumber: undefined },
  },
};
