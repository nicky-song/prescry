// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { BaseTag, IBaseTagProps } from './base.tag';
import { List } from '../../primitives/list';

export default {
  title: 'Tags/BaseTag',
  component: BaseTag,
};

const ArgsWrapper: Story<IBaseTagProps> = (args) => (
  <List>
    <BaseTag {...args} />
  </List>
);

export const WithoutIcon = ArgsWrapper.bind({});
WithoutIcon.args = {
  label: 'Sample',
};

export const WithIcon = ArgsWrapper.bind({});
WithIcon.args = {
  label: 'Sample',
  iconName: 'star',
};

export const WithSolidIcon = ArgsWrapper.bind({});
WithSolidIcon.args = {
  label: 'Sample',
  iconName: 'star',
  iconSolid: true,
};
