// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  RxLabelWithValue,
  IRxLabelWithValueWithStyles,
} from './rx-label-with-value';

export default {
  title: 'Text/RxLabelWithValue',
  component: RxLabelWithValue,
};

const ArgsWrapper: Story<IRxLabelWithValueWithStyles> = (args) => (
  <RxLabelWithValue {...args} />
);

export const PBM = ArgsWrapper.bind({});
PBM.args = {
  label: 'label',
  value: 'value',
  isSkeleton: false,
  rxType: 'pbm',
};

export const SmartPrice = ArgsWrapper.bind({});
SmartPrice.args = {
  label: 'label',
  value: 'value',
  isSkeleton: false,
  rxType: 'smartPrice',
};
