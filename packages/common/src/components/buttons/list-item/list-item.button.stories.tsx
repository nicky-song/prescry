// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { BaseText } from '../../text/base-text/base-text';
import { ListItemButton, IListItemButtonProps } from './list-item.button';
export default {
  title: 'Buttons/ListItemButton',
  component: ListItemButton,
  args: {
    children: <BaseText>Prescryptive</BaseText>,
  },
};

const ArgsWrapper: Story<IListItemButtonProps> = (args) => (
  <ListItemButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
