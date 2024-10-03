// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { NavigationLink, INavigationLinkProps } from './navigation.link';

export default {
  title: 'Links/NavigationLink',
  component: NavigationLink,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<INavigationLinkProps> = (args) => (
  <NavigationLink {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  label: 'Sample label',
};

export const WithCustomLinkColor = ArgsWrapper.bind({});
WithCustomLinkColor.args = {
  label: 'Sample label (blue)',
  linkColor: 'blue',
};
