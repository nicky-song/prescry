// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ShowMoreButton, IShowMoreButtonProps } from './show-more.button';

export default {
  title: 'Buttons/ShowMoreButton',
  component: ShowMoreButton,
};

const ArgsWrapper: Story<IShowMoreButtonProps> = (args) => (
  <ShowMoreButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  message: 'Show other locations',
};
