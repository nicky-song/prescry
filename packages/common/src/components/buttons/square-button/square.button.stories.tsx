// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ISquareButtonProps, SquareButton } from './square.button';

export default {
  title: 'buttons/SquareButton',
  component: SquareButton,
  argTypes: { onPress: { action: 'pressed' } },
} as Meta;

const ArgsWrapper: Story<ISquareButtonProps> = (args) => (
  <SquareButton {...args} />
);

export const Primary = ArgsWrapper.bind({});
Primary.args = {
  children: 'Sample caption',
  disabled: false,
};

export const Secondary = ArgsWrapper.bind({});
Secondary.args = {
  children: 'Sample caption',
  rank: 'secondary',
  disabled: false,
};
