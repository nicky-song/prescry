// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { FilterButton, IFilterButtonProps } from './filter.button';

export default {
  title: 'Buttons/FilterButton',
  component: FilterButton,
  argTypes: { onPress: { action: 'pressed' } },
  args: {},
};

const ArgsWrapper: Story<IFilterButtonProps> = (args: IFilterButtonProps) => (
  <FilterButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
