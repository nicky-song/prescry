// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  AccumulatorProgressBar,
  IAccumulatorProgressBarProps,
} from './accumulator.progress-bar';

export default {
  title: 'Progress Bars/AccumulatorProgressBar',
  component: AccumulatorProgressBar,
};

const ArgsWrapper: Story<IAccumulatorProgressBarProps> = (args) => (
  <AccumulatorProgressBar {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'Sample title',
  value: 1385,
  maxValue: 5000,
};
Default.argTypes = { onInfoPress: { action: 'pressed' } };

export const NoInfo = ArgsWrapper.bind({});
NoInfo.args = {
  title: 'Sample title',
  value: 1385,
  maxValue: 5000,
};
