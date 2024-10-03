// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ClaimPharmacyInfo,
  IClaimPharmacyInfoProps,
} from './claim-pharmacy-info';

export default {
  title: 'Shopping/ClaimPharmacyInfo',
  component: ClaimPharmacyInfo,
};

const ArgsWrapper: Story<IClaimPharmacyInfoProps> = (args) => (
  <ClaimPharmacyInfo {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {
  phoneNumber: '777-444-2222',
  pharmacyAddress1: '2127 S Hwy 97 STE 150',
  pharmacyCity: 'Redmond',
  pharmacyZipCode: '97756',
  pharmacyState: 'OR',
  title: 'Prescryptive Pharmacy',
};
