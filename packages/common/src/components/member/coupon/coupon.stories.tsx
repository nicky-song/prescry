// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ICouponProps, Coupon } from './coupon';

export default {
  title: 'Coupons/Coupon',
  component: Coupon,
};

const ArgsWrapper: Story<ICouponProps> = (args) => <Coupon {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  price: 28.99,
  productName: 'Gralise',
  group: 'EC95001001',
  pcn: 'CN',
  bin: '004682',
  memberId: '58685267102',
};
