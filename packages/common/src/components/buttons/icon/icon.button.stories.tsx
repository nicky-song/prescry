// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IconButton, IIconButtonProps } from './icon.button';
import { IconSize } from '../../../theming/icons';

export default {
  title: 'Buttons/IconButton',
  component: IconButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<IIconButtonProps> = (args) => <IconButton {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  iconName: 'directions',
  accessibilityLabel: 'Button information',
};

export const BigIcon = ArgsWrapper.bind({});
BigIcon.storyName = 'Big icon';
BigIcon.args = {
  iconName: 'directions',
  iconTextStyle: { fontSize: IconSize.big },
};
