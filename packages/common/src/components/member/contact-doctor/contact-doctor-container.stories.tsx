// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';

import {
  ContactDoctorContainer,
  IContactDoctorContainerProps,
} from './contact-doctor-container';

export default {
  title: 'Containers/ContactDoctorContainer',
  component: ContactDoctorContainer,
};

const ArgsWrapper: Story<IContactDoctorContainerProps> = (args) => (
  <ContactDoctorContainer {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  doctorName: 'Dr. Ryan Williams, MD',
  phoneNumber: '+17777777777',
};
