// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { HomeButton, IHomeButtonProps } from './home.button';

export default {
  title: 'Buttons/HomeButton',
  component: HomeButton,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IHomeButtonProps> = (args) => <HomeButton {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {};
