// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PricingText, IPricingTextProps } from './pricing.text';

export default {
  title: 'Text/PricingText',
  component: PricingText,
};

const ArgsWrapper: Story<IPricingTextProps> = (args) => (
  <PricingText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  drugPricing: { memberPays: 7.77, planPays: 3.33 },
  pricingTextFormat: 'summary',
};
