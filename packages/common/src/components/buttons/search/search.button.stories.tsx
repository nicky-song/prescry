// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { SearchButton, ISearchButtonProps } from './search.button';
export default {
  title: 'Buttons/SearchButton',
  component: SearchButton,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<ISearchButtonProps> = (args) => (
  <SearchButton {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  label: 'Sample label',
};
