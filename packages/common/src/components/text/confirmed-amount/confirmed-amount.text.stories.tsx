// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ConfirmedAmountText,
  IConfirmedAmountTextProps,
} from './confirmed-amount.text';

export default {
  title: 'Text/ConfirmedAmountText',
  component: ConfirmedAmountText,
  args: {},
};

const ArgsWrapper: Story<IConfirmedAmountTextProps> = (args) => (
  <ConfirmedAmountText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.storyName = 'default';
Default.args = {
  children: 'Sample text',
};
