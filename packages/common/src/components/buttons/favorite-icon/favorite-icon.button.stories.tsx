// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  FavoriteIconButton,
  IFavoriteIconButtonProps,
} from './favorite-icon.button';

export default {
  title: 'Buttons/FavoriteIconButton',
  component: FavoriteIconButton,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IFavoriteIconButtonProps> = (args) => (
  <FavoriteIconButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
