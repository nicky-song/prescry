// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PbmPricingOptionInformativePanel,
  IPbmPricingOptionInformativePanelProps,
} from './pbm-pricing-option-informative.panel';

export default {
  title: 'Panels/PbmPricingOptionInformativePanel',
  component: PbmPricingOptionInformativePanel,
};

const ArgsWrapper: Story<IPbmPricingOptionInformativePanelProps> = (args) => (
  <PbmPricingOptionInformativePanel {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  memberPays: 45,
  planPays: 20,
};
