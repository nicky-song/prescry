// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { SideMenuFooter } from './side-menu.footer';

export default {
  title: 'Footers/SideMenuFooter',
  component: SideMenuFooter,
};

const ArgsWrapper: Story = (args) => <SideMenuFooter {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {};
