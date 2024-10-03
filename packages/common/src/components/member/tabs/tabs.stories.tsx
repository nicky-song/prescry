// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { Tabs, ITabsProps } from './tabs';
import { Text } from 'react-native';

export default {
  title: 'Tabs/Tabs',
  component: Tabs,
  args: {},
};

const ArgsWrapper: Story<ITabsProps> = (args: ITabsProps) => <Tabs {...args} />;

const tabs = [
  { name: 'Upcoming', content: <Text>Example 1 Loremp Ipsum</Text> },
  { name: 'Past', content: <Text>Example 2 Ipsum lorem</Text> },
  { name: 'Cancelled', content: <Text>Example 3 Ipsum lorem</Text> },
];

export const Default = ArgsWrapper.bind({});
Default.args = {
  tabs,
};
