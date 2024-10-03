// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  SwitchingMedicationContainer,
  ISwitchingMedicationContainerProps,
} from './switching-medication.container';

export default {
  title: 'Containers/SwitchingMedicationContainer',
  component: SwitchingMedicationContainer,
};

const ArgsWrapper: Story<ISwitchingMedicationContainerProps> = (args) => (
  <SwitchingMedicationContainer {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  prescribedMedicationProps: {
    drugName: 'Invokana',
    drugDetails: {
      formCode: 'capsules',
      quantity: 30,
      strength: '150',
      unit: 'mg',
      supply: 30,
    },
    price: 141.58,
    planPrice: 707.9,
  },
  prescriptionDetailsProps: {
    title: 'Alternative medication',
    memberSaves: 0,
    planSaves: 47,
    prescriptionDetailsList: [
      {
        productName: 'Farxiga',
        quantity: 30,
        formCode: 'capsules',
        supply: 30,
        memberPays: 40,
        planPays: 50,
      },
      {
        productName: 'Januvia',
        quantity: 30,
        formCode: 'capsules',
        supply: 30,
        memberPays: 45,
        planPays: 65,
      },
    ],
    drugPricing: { memberPays: 85, planPays: 115 },
    isShowingPriceDetails: true,
  },
};
