// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IPharmacyInfoTextProps, PharmacyInfoText } from './pharmacy-info.text';

export default {
  title: 'Text/PharmacyInfoText',
  component: PharmacyInfoText,
};

const ArgsWrapper: Story<IPharmacyInfoTextProps> = (args) => (
  <PharmacyInfoText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  pharmacyInfo: {
    name: 'Pharmacy',
    address: {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    },
  },
};
