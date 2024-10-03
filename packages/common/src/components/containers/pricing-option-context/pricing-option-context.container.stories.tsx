// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IPricingOptionContextContainerProps,
  PricingOptionContextContainer,
} from './pricing-option-context.container';

export default {
  title: 'Containers/PricingOptionContextContainer',
  component: PricingOptionContextContainer,
};

const ArgsWrapper: Story<IPricingOptionContextContainerProps> = (args) => (
  <PricingOptionContextContainer {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  drugName: 'QUININE SULFATE',
  drugDetails: {
    strength: '500',
    unit: 'mg',
    formCode: 'tablets',
    quantity: 60,
    supply: 30,
  },
  pharmacyInfo: {
    name: 'Pharmacy',
    address: {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    },
  },
};
