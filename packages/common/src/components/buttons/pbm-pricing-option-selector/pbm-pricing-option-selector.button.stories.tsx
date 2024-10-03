// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IPbmPricingOptionSelectorButtonProps,
  PbmPricingOptionSelectorButton,
} from './pbm-pricing-option-selector.button';

export default {
  title: 'Buttons/PbmPricingOptionSelectorButton',
  component: PbmPricingOptionSelectorButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<IPbmPricingOptionSelectorButtonProps> = (args) => (
  <PbmPricingOptionSelectorButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  planPays: 42.45,
  memberPays: 16.47,
};
