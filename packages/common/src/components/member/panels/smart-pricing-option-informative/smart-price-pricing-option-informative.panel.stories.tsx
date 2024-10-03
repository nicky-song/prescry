// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  SmartPricePricingOptionInformativePanel,
  ISmartPricePricingOptionInformativePanelProps,
} from './smart-price-pricing-option-informative.panel';

export default {
  title: 'Panels/SmartPricePricingOptionInformativePanel',
  component: SmartPricePricingOptionInformativePanel,
};

const ArgsWrapper: Story<ISmartPricePricingOptionInformativePanelProps> = (
  args
) => <SmartPricePricingOptionInformativePanel {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberPays: 45,
};
