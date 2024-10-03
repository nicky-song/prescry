// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  DrawerHamburgerAuthButton,
  IDrawerHamburgerAuthButtonProps,
} from './drawer-hamburger-auth.button';

export default {
  title: 'Buttons/DrawerHamburgerAuthButton',
  component: DrawerHamburgerAuthButton,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IDrawerHamburgerAuthButtonProps> = (args) => (
  <DrawerHamburgerAuthButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
