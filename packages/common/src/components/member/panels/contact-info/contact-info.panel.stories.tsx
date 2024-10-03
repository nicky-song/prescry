// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ContactInfoPanel, IContactInfoPanelProps } from './contact-info.panel';

export default {
  title: 'Panels/ContactInfoPanel',
  component: ContactInfoPanel,
};

const ArgsWrapper: Story<IContactInfoPanelProps> = (args) => (
  <ContactInfoPanel {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  title: 'Sample title',
  email: 'someone@somewhere.com',
  phoneNumber: '+1234567890',
};

export const NoPhone = ArgsWrapper.bind({});
NoPhone.storyName = 'No phone number';
NoPhone.args = {
  title: 'Sample title',
  email: 'someone@somewhere.com',
};
