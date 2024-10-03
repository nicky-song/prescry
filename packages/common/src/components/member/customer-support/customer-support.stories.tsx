// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { CustomerSupport, ICustomerSupportProps } from './customer-support';

export default {
  title: 'Support/CustomerSupport',
  component: CustomerSupport,
  args: {},
};

const ArgsWrapper: Story<ICustomerSupportProps> = (args) => (
  <CustomerSupport {...args} />
);

export const Regular = ArgsWrapper.bind({});
Regular.args = {};
