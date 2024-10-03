// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  FavoritePharmacyCard,
  IFavoritePharmacyCardProps,
} from './favorite-pharmacy.card';

export default {
  title: 'Cards/FavoritePharmacyCard',
  component: FavoritePharmacyCard,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IFavoritePharmacyCardProps> = (args) => (
  <FavoritePharmacyCard {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  pharmacyName: "Jackson's Pharmacy",
  pharmacyAddress: '777 Lucky Ave, Kirkland, WA',
  pharmacyNcpdp: '777',
};
