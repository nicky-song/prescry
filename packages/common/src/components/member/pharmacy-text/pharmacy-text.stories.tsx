// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PharmacyText, IPharmacyTextProps } from './pharmacy-text';

export default {
  title: 'Text/PharmacyText',
  component: PharmacyText,
  args: {
    pharmacy: 'FRED MEYER PHARMACY #21',
  },
};

const ArgsWrapper: Story<IPharmacyTextProps> = (args) => (
  <PharmacyText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
