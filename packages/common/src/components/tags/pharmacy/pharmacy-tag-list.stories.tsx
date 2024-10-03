// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PharmacyTagList, IPharmacyTagList } from './pharmacy-tag-list';

export default {
  title: 'Tags/PharmacyTagList',
  component: PharmacyTagList,
};

const ArgsWrapper: Story<IPharmacyTagList> = (args) => (
  <PharmacyTagList {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  isBestValue: true,
  isFavoritedPharmacy: true,
  isHomeDelivery: true,
};
