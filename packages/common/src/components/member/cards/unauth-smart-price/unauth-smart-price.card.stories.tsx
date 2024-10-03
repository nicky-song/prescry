// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IUnauthSmartPriceCardProps,
  UnauthSmartPriceCard,
} from './unauth-smart-price.card';

export default {
  title: 'Cards/UnauthSmartPriceCard',
  component: UnauthSmartPriceCard,
};

const ArgsWrapper: Story<IUnauthSmartPriceCardProps> = (args) => (
  <UnauthSmartPriceCard {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
