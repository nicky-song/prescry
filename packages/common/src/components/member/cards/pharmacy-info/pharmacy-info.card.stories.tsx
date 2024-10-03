// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PharmacyInfoCard, IPharmacyInfoCardProps } from './pharmacy-info.card';

export default {
  title: 'Cards/PharmacyInfoCard',
  component: PharmacyInfoCard,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IPharmacyInfoCardProps> = (args) => (
  <PharmacyInfoCard {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  address: {
    lineOne: '1234 Pharmacy Blvd',
    city: 'Redmond',
    state: 'WA',
    zip: '98052',
  },
  distance: 3.3,
  serviceStatus: 'Closes 11:59 pm',
};
