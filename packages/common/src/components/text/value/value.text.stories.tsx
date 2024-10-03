// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ValueText, IValueTextProps } from './value.text';

export default {
  title: 'Text/ValueText',
  component: ValueText,
  args: {},
};

const ArgsWrapper: Story<IValueTextProps> = (args) => <ValueText {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: 'Sample text',
};
