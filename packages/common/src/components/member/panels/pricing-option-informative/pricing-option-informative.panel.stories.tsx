// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PricingOptionInformativePanel,
  IPricingOptionInformativePanelProps,
} from './pricing-option-informative.panel';

export default {
  title: 'Panels/PricingOptionInformativePanel',
  component: PricingOptionInformativePanel,
};

const ArgsWrapper: Story<IPricingOptionInformativePanelProps> = (args) => (
  <PricingOptionInformativePanel {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'With Insurance',
  subText: 'Your plan pays $42.45',
  memberPays: 45,
};
