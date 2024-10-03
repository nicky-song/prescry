// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  SmartPriceSection,
  ISmartPriceSectionProps,
} from './smart-price.section';

export default {
  title: 'Sections/SmartPriceSection',
  component: SmartPriceSection,
  argTypes: { onLearnMorePress: { action: 'pressed' } },
};

const ArgsWrapper: Story<ISmartPriceSectionProps> = (args) => (
  <SmartPriceSection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
