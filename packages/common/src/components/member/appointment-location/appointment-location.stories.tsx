// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  AppointmentLocation,
  IAppointmentLocationProps,
} from './appointment-location';

export default {
  title: 'Appointments/AppointmentLocation',
  component: AppointmentLocation,
};

const ArgsWrapper: Story<IAppointmentLocationProps> = (args) => (
  <AppointmentLocation {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  selectedLocation: {
    address1: '1 Airport Rd.',
    city: 'Chicken',
    state: 'AK',
    zip: '99732',
    locationName: '',
    id: '',
    providerName: 'SMALL TOWN PHARMACIES',
    timezone: '',
    serviceInfo: [],
  },
};
