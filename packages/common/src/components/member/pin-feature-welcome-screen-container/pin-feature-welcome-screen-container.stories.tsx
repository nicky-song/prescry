// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PinFeatureWelcomeScreenContainer } from './pin-feature-welcome-screen-container';

export default {
  title: 'Containers/PinFeatureWelcomeScreenContainer',
  component: PinFeatureWelcomeScreenContainer,
  args: {},
};

const ArgsWrapper: Story = (args) => (
  <PinFeatureWelcomeScreenContainer {...args} />
);

export const Default = ArgsWrapper.bind({});
