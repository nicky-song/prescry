// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  AlternativeMedication,
  IAlternativeMedicationProps,
} from './alternative-medication';
import { IPrescriptionDetails } from '../../../models/prescription-details';

export default {
  title: 'Prescription/AlternativeMedication',
  component: AlternativeMedication,
};

const ArgsWrapper: Story<IAlternativeMedicationProps> = (args) => (
  <AlternativeMedication {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberSaves: 77,
  planSaves: 7,
  prescriptionDetailsList: [
    {
      productName: 'Januvia',
      quantity: 60,
      strength: '100',
      unit: 'mg',
      formCode: 'tablets',
    } as IPrescriptionDetails,
  ],
  drugPricing: {
    memberPays: 3,
    planPays: 33,
  },
};
