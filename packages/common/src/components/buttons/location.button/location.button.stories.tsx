// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { LocationButton, ILocationButtonProps } from './location.button';

export default {
  title: 'Buttons/LocationButton',
  component: LocationButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<ILocationButtonProps> = (args) => (
  <LocationButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  location: 'Vancouver, BC',
};
