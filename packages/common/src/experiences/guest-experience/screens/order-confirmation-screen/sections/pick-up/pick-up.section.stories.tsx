// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IPickupSectionProps, PickUpSection } from './pick-up.section';

export default {
  title: 'Shopping/Confirmation/Sections/PickUpSection',
  component: PickUpSection,
};

const ArgsWrapper: Story<IPickupSectionProps> = (args) => (
  <PickUpSection {...args} />
);

export const Default = ArgsWrapper.bind({});

Default.args = {
  pharmacy: {
    address: {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      state: 'WA',
      zip: '98101',
    },
    phoneNumber: '4258815845',
    name: 'Value Drug Mart',
    ncpdp: '12345678',
    twentyFourHours: true,
    hours: [],
    isMailOrderOnly: false,
  },
};
