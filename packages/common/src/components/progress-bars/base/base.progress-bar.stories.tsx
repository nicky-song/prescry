// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { BaseProgressBar, IBaseProgressBarProps } from './base.progress-bar';

export default {
  title: 'Progress Bars/BaseProgressBar',
  component: BaseProgressBar,
};

const ArgsWrapper: Story<IBaseProgressBarProps> = (args) => (
  <BaseProgressBar {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  value: 0.5,
};

export const WithLabels = ArgsWrapper.bind({});
WithLabels.storyName = 'With labels';
WithLabels.args = {
  accessibilityLabel: 'With labels',
  value: 0.75,
  minLabel: 'Sample min label',
  maxLabel: 'Sample max label',
};

export const WithLabelsMinMax = ArgsWrapper.bind({});
WithLabelsMinMax.storyName = 'With labels and supplied min/max';
WithLabelsMinMax.args = {
  accessibilityLabel: 'With labels and supplied min/max',
  minValue: 0,
  maxValue: 100,
  value: 25,
  minLabel: 'Sample min label',
  maxLabel: 'Sample max label',
};

export const WithLabelsOnTop = ArgsWrapper.bind({});
WithLabelsOnTop.storyName = 'With labels on top';
WithLabelsOnTop.args = {
  accessibilityLabel: 'With labels on top',
  minValue: 0,
  maxValue: 100,
  value: 25,
  minLabel: 'Sample min label',
  maxLabel: 'Sample max label',
  labelPosition: 'top',
};

export const WithProgressBarColors = ArgsWrapper.bind({});
WithProgressBarColors.storyName = 'With progress bar colors';
WithProgressBarColors.args = {
  accessibilityLabel: 'With progress bar colors',
  backgroundBarColor: '#DAF9EC',
  progressBarColors: ['#318F7C'],
  value: 0.33,
  minLabel: 'Sample min label',
  maxLabel: 'Sample max label',
};
