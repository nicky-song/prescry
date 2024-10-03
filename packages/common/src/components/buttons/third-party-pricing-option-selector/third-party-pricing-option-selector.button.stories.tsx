// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  IThirdPartyPricingOptionSelectorButtonProps,
  ThirdPartyPricingOptionSelectorButton,
} from './third-party-pricing-option-selector.button';

export default {
  title: 'Buttons/ThirdPartyPricingOptionSelectorButton',
  component: ThirdPartyPricingOptionSelectorButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<IThirdPartyPricingOptionSelectorButtonProps> = (
  args
) => <ThirdPartyPricingOptionSelectorButton {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberPays: 16.47,
};
