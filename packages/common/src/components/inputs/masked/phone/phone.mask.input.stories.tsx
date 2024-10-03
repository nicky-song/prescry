// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PhoneMaskInput, IPhoneMaskInputProps } from './phone.mask.input';

export default {
  title: 'Inputs/PhoneMaskInput',
  component: PhoneMaskInput,
  argTypes: { onChangeText: { action: 'onChangeText' } },
};

const ArgsWrapper: Story<IPhoneMaskInputProps> = (args) => (
  <PhoneMaskInput {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

export const WithLabel = ArgsWrapper.bind({});
WithLabel.storyName = 'With label';
WithLabel.args = {
  label: 'Sample label',
};

export const ReadOnly = ArgsWrapper.bind({});
ReadOnly.storyName = 'Read-only';
ReadOnly.args = {
  label: 'Sample label',
  editable: false,
  phoneNumber: '1234567890',
};
