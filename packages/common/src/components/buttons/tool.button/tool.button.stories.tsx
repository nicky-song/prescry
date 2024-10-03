// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ToolButton, IToolButtonProps } from './tool.button';
import { IconSize } from '../../../theming/icons';

export default {
  title: 'Buttons/ToolButton',
  component: ToolButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<IToolButtonProps> = (args) => <ToolButton {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: 'Sample Button',
  iconName: 'directions',
};

export const BigIcon = ArgsWrapper.bind({});
BigIcon.storyName = 'Big icon';
BigIcon.args = {
  children: 'Sample Button',
  iconName: 'directions',
  iconTextStyle: { fontSize: IconSize.big },
};
