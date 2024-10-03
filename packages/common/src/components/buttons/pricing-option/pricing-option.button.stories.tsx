// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IPricingOptionButtonProps,
  PricingOptionButton,
} from './pricing-option.button';

export default {
  title: 'Buttons/PricingOptionButton',
  component: PricingOptionButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<IPricingOptionButtonProps> = (args) => (
  <PricingOptionButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'With insurance',
  subText: 'Your plan pays $42.45',
  memberPays: 16.47,
};
