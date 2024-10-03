// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IPricingOptionGroupProps,
  IPricingOptionSelectorOption,
  PricingOptionGroup,
} from './pricing-option-group';

export default {
  title: 'Buttons/PricingOptionGroup',
  component: PricingOptionGroup,
  argTypes: {
    onSelect: { action: 'onSelect' },
  },
};

const ArgsWrapper: Story<IPricingOptionGroupProps> = (args) => (
  <PricingOptionGroup
    {...args}
    onSelect={(value) => {
      console.log('onSelect', value);
    }}
  />
);

const DefaultOptions: IPricingOptionSelectorOption[] = [
  {
    pricingOption: 'smartPrice',
    memberPays: 16.47,
  },
  {
    pricingOption: 'pbm',
    memberPays: 26.8,
    planPays: 10,
  },
  {
    pricingOption: 'thirdParty',
    memberPays: 99.0,
  },
];
export const Default = ArgsWrapper.bind({});
Default.args = {
  options: DefaultOptions,
};

export const InitialSelection = ArgsWrapper.bind({});
InitialSelection.storyName = 'Second button selected';
InitialSelection.args = {
  options: DefaultOptions,
  selected: 'pbm',
};
