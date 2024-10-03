// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  IPromotionLinkButtonProps,
  PromotionLinkButton,
} from './promotion-link.button';

export default {
  title: 'Buttons/PromotionLinkButton',
  component: PromotionLinkButton,
  argTypes: { onPress: { action: 'pressed' } },
} as Meta;

const ArgsWrapper: Story<IPromotionLinkButtonProps> = (args) => (
  <PromotionLinkButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  promotionText: 'Pay as little as $28 with manufacturer coupon.',
  linkText: 'Check my eligibility.',
  image: 'couponIcon',
};
