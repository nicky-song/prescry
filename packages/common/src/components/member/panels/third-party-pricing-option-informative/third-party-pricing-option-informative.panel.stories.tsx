// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ThirdPartyPricingOptionInformativePanel,
  IThirdPartyPricingOptionInformativePanelProps,
} from './third-party-pricing-option-informative.panel';

export default {
  title: 'Panels/ThirdPartyPricingOptionInformativePanel',
  component: ThirdPartyPricingOptionInformativePanel,
};

const ArgsWrapper: Story<IThirdPartyPricingOptionInformativePanelProps> = (
  args
) => <ThirdPartyPricingOptionInformativePanel {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberPays: 45,
};
