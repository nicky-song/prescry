// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { FieldHelpText, IFieldHelpTextProps } from './field-help.text';

export default {
  title: 'Text/FieldHelpText',
  component: FieldHelpText,
  args: {},
};

const ArgsWrapper: Story<IFieldHelpTextProps> = (args) => (
  <FieldHelpText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: 'Sample text',
};
