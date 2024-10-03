// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  SkeletonPharmacyCard,
  ISkeletonPharmacyCardProps,
} from './skeleton-pharmacy.card';

export default {
  title: 'Overlays/SkeletonPharmacyCard',
  component: SkeletonPharmacyCard,
};

const ArgsWrapper: Story<ISkeletonPharmacyCardProps> = (args) => (
  <SkeletonPharmacyCard {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  isBestPricePharmacy: true,
};
