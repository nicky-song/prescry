// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { FieldErrorText, IFieldErrorTextProps } from './field-error.text';

export default {
  title: 'Text/FieldErrorText',
  component: FieldErrorText,
  args: {},
};

const ArgsWrapper: Story<IFieldErrorTextProps> = (args) => (
  <FieldErrorText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: 'Sample text',
};
