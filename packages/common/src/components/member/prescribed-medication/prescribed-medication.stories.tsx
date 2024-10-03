// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IPrescribedMedicationProps,
  PrescribedMedication,
} from './prescribed-medication';

export default {
  title: 'Cards/PrescribedMedication',
  component: PrescribedMedication,
  args: {},
};

const ArgsWrapper: Story<IPrescribedMedicationProps> = (args) => (
  <PrescribedMedication {...args} />
);

export const WithPricesAndPharmacyDetail = ArgsWrapper.bind({});
WithPricesAndPharmacyDetail.args = {
  drugName: 'Lipitor',
  drugDetails: {
    formCode: 'TAB',
    strength: '10',
    unit: 'mg',
    quantity: 30,
    supply: 30,
  },
  price: 35,
  planPrice: 30,
  pharmacyName: 'Value Drug Mart',
  orderDate: '10/10/2023',
};

export const WithoutPricesAndPharmacyDetail = ArgsWrapper.bind({});
WithoutPricesAndPharmacyDetail.args = {
  drugName: 'Lipitor',
  drugDetails: {
    formCode: 'TAB',
    strength: '10',
    unit: 'mg',
    quantity: 30,
    supply: 30,
  },
};
