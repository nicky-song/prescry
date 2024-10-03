// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ISmartPricePricingOptionSelectorButtonProps,
  SmartPricePricingOptionSelectorButton,
} from './smart-price-pricing-option-selector.button';

export default {
  title: 'Buttons/SmartPricePricingOptionSelectorButton',
  component: SmartPricePricingOptionSelectorButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<ISmartPricePricingOptionSelectorButtonProps> = (
  args
) => <SmartPricePricingOptionSelectorButton {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberPays: 16.47,
};
