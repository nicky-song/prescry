// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  DrugWithPriceSection,
  IDrugWithPriceSectionProps,
} from './drug-with-price.section';

export default {
  title: 'Drug search/DrugWithPriceSection',
  component: DrugWithPriceSection,
  args: {},
};

const ArgsWrapper: Story<IDrugWithPriceSectionProps> = (args) => (
  <DrugWithPriceSection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  drugName: 'Lipitor',
  drugDetails: {
    formCode: 'TAB',
    strength: '10',
    unit: 'mg',
    quantity: 30,
    supply: 30,
  },
  price: 35,
};
