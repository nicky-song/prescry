// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  EmphasizedAmountText,
  IEmphasizedAmountTextProps,
} from './emphasized-amount.text';

export default {
  title: 'Text/EmphasizedAmountText',
  component: EmphasizedAmountText,
  args: {},
};

const ArgsWrapper: Story<IEmphasizedAmountTextProps> = (args) => (
  <EmphasizedAmountText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.storyName = 'default';
Default.args = {
  children: 'Sample text',
};
