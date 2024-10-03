// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PrescriptionDetails,
  IPrescriptionDetailsProps,
} from './prescription-details';

export default {
  title: 'Prescription/PrescriptionDetails',
  component: PrescriptionDetails,
};

const ArgsWrapper: Story<IPrescriptionDetailsProps> = (args) => (
  <PrescriptionDetails {...args} />
);

export const Combo = ArgsWrapper.bind({});
Combo.args = {
  title: 'Alternative combination',
  memberSaves: 56,
  prescriptionDetailsList: [
    {
      productName: 'Drug 1',
      quantity: 30,
      strength: '150',
      unit: 'mg',
      formCode: 'capsules',
      supply: 30,
      memberPays: 2,
      planPays: 3,
    },
    {
      productName: 'Drug 2',
      quantity: 30,
      strength: '300',
      unit: 'mg',
      formCode: 'tablets',
      supply: 30,
      memberPays: 3,
      planPays: 2,
    },
  ],
  drugPricing: {
    memberPays: 5,
    planPays: 5,
  },
};

export const Single = ArgsWrapper.bind({});
Single.args = {
  title: 'Alternative medication',
  planSaves: 56,
  prescriptionDetailsList: [
    {
      productName: 'Drug 1',
      quantity: 30,
      strength: '150',
      unit: 'mg',
      formCode: 'capsules',
      supply: 30,
      memberPays: 2,
      planPays: 3,
    },
  ],
  drugPricing: {
    memberPays: 10,
    planPays: 10,
  },
};

export const SingleSwitching = ArgsWrapper.bind({});
SingleSwitching.args = {
  title: 'Alternative medication',
  memberSaves: 56,
  prescriptionDetailsList: [
    {
      productName: 'Drug 1',
      quantity: 30,
      strength: '150',
      unit: 'mg',
      formCode: 'capsules',
      supply: 30,
      memberPays: 15,
      planPays: 15,
    },
  ],
  drugPricing: {
    memberPays: 15,
    planPays: 15,
  },
};

export const ComboSwitching = ArgsWrapper.bind({});
ComboSwitching.args = {
  title: 'Alternative medication',
  planSaves: 56,
  prescriptionDetailsList: [
    {
      productName: 'Drug 1',
      quantity: 30,
      strength: '150',
      unit: 'mg',
      formCode: 'capsules',
      supply: 30,
      memberPays: 5,
      planPays: 10,
    },
    {
      productName: 'Drug 2',
      quantity: 30,
      strength: '300',
      unit: 'mg',
      formCode: 'capsules',
      supply: 30,
      memberPays: 10,
      planPays: 5,
    },
  ],
  drugPricing: {
    memberPays: 15,
    planPays: 15,
  },
  isShowingPriceDetails: true,
};
