// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IInsuranceProps, Insurance } from './insurance';

export default {
  title: 'Member/Insurance',
  component: Insurance,
  argTypes: { insuranceChanged: { action: 'changed' } },
};

const ArgsWrapper: Story<IInsuranceProps> = (args: IInsuranceProps) => (
  <Insurance {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
