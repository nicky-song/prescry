// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  NoPricePricingOptionInformativePanel,
  INoPricePricingOptionInformativePanelProps,
} from './no-price-pricing-option-informative.panel';

export default {
  title: 'Panels/NoPricePricingOptionInformativePanel',
  component: NoPricePricingOptionInformativePanel,
};

const ArgsWrapper: Story<INoPricePricingOptionInformativePanelProps> = (
  args
) => <NoPricePricingOptionInformativePanel {...args} />;

export const Default = ArgsWrapper.bind({});
