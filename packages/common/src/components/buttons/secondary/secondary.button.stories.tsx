// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ISecondaryButtonProps, SecondaryButton } from './secondary.button';

export default {
  title: 'buttons/SecondaryButton',
  component: SecondaryButton,
  argTypes: { onPress: { action: 'pressed' } },
} as Meta;

const ArgsWrapper: Story<ISecondaryButtonProps> = (args) => (
  <SecondaryButton {...args} />
);

export const Large = ArgsWrapper.bind({});
Large.args = {
  children: 'Sample caption',
  size: 'large',
  disabled: false,
};

export const Medium = ArgsWrapper.bind({});
Medium.args = {
  children: 'Sample caption',
  size: 'medium',
  disabled: false,
};
