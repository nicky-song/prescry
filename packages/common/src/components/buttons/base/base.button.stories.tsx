// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IBaseButtonProps, BaseButton } from './base.button';

export default {
  title: 'Buttons/BaseButton',
  component: BaseButton,
  argTypes: { onPress: { action: 'pressed' } },
} as Meta;

const ArgsWrapper: Story<IBaseButtonProps> = (args) => <BaseButton {...args} />;

export const Large = ArgsWrapper.bind({});
Large.args = {
  children: 'Sample content',
};

export const Medium = ArgsWrapper.bind({});
Medium.args = {
  children: 'Sample content',
  size: 'medium',
};
