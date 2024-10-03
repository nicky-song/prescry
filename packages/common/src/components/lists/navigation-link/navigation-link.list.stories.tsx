// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  NavigationLinkList,
  INavigationLinkListProps,
} from './navigation-link.list';

export default {
  title: 'Lists/NavigationLinkList',
  component: NavigationLinkList,
};

const ArgsWrapper: Story<INavigationLinkListProps> = (args) => (
  <NavigationLinkList {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  links: [
    {
      key: 'link1',
      label: 'Sample link one',
      onPress: action('Sample link one'),
    },
    {
      key: 'link2',
      label: 'Sample link two',
      onPress: action('Sample link two'),
    },
  ],
};
