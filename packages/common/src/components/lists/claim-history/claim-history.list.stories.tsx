// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IClaimHistoryListProps, ClaimHistoryList } from './claim-history.list';
import { IClaim } from '../../../models/claim';

export default {
  title: 'Lists/ClaimHistoryList',
  component: ClaimHistoryList,
};

const claim1Mock: IClaim = {
  prescriptionId: '1',
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
  },
  filledOn: new Date(),
  billing: {
    memberPays: 1.86,
    deductibleApplied: 1.86,
  },
};

const claim2Mock: IClaim = {
  prescriptionId: '2',
  drugName: 'Medicine B',
  ndc: '12345',
  formCode: 'TAB',
  strength: '100mg',
  quantity: 20,
  daysSupply: 22,
  refills: 2,
  orderNumber: '112233',
  practitioner: {
    id: 'practitioner-2',
    name: 'Dr. Two',
    phoneNumber: '2222222222',
  },
  pharmacy: {
    name: 'Rx Pharmacy 2',
    ncpdp: '1',
  },
  filledOn: new Date(),
  billing: {
    memberPays: 4.86,
    deductibleApplied: 4.86,
  },
};

const ArgsWrapper: Story<IClaimHistoryListProps> = (args) => (
  <ClaimHistoryList {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  claims: [claim1Mock as IClaim, claim2Mock as IClaim],
};
