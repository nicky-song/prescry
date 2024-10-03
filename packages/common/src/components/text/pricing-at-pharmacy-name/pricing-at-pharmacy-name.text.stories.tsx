// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  PricingAtPharmacyNameText,
  IPricingAtPharmacyNameTextProps,
} from './pricing-at-pharmacy-name.text';

export default {
  title: 'Text/PricingAtPharmacyNameText',
  component: PricingAtPharmacyNameText,
};

const ArgsWrapper: Story<IPricingAtPharmacyNameTextProps> = (args) => (
  <PricingAtPharmacyNameText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  pharmacyName: "Jackson's Pharmacy #1",
};
