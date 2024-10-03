// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { AddressLink, IAddressLinkProps } from './address.link';

export default {
  title: 'Links/AddressLink',
  component: AddressLink,
};

const ArgsWrapper: Story<IAddressLinkProps> = (args) => (
  <AddressLink {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  formattedAddress: '1 Airport Rd., Chicken, AK 99732',
};
