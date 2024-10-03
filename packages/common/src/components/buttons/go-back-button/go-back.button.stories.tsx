// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { GoBackButton, IGoBackButtonProps } from './go-back.button';
export default {
  title: 'Buttons/GoBackButton',
  component: GoBackButton,
  args: {},
};

const ArgsWrapper: Story<IGoBackButtonProps> = (args) => (
  <GoBackButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
