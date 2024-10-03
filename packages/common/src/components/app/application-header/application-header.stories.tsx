// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ApplicationHeader,
  IApplicationHeaderProps,
} from './application-header';

export default {
  title: 'Layout/ApplicationHeader',
  component: ApplicationHeader,
  args: {},
};

const ArgsWrapper: Story<IApplicationHeaderProps> = (args) => (
  <ApplicationHeader {...args} />
);

export const WithBackNavigation = ArgsWrapper.bind({});
WithBackNavigation.storyName = 'With back navigation';
WithBackNavigation.args = {
  navigateBack: () => true,
};

export const WithoutBackNavigation = ArgsWrapper.bind({});
WithoutBackNavigation.storyName = 'Without back navigation';
WithoutBackNavigation.args = {
  navigateBack: undefined,
};
