// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  AlternativeSavingsCard,
  IAlternativeSavingsCardProps,
} from './alternative-savings.card';

export default {
  title: 'Cards/AlternativeSavingsCard',
  component: AlternativeSavingsCard,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IAlternativeSavingsCardProps> = (args) => (
  <AlternativeSavingsCard {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {
  savingsAmount: 79,
};
