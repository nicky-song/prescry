// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { PrimaryTextInput, IPrimaryTextInputProps } from './primary-text.input';

export default {
  title: 'Inputs/PrimaryTextInput',
  component: PrimaryTextInput,
  argTypes: { onChangeText: { action: 'onChangeText' } },
};

const ArgsWrapper: Story<IPrimaryTextInputProps> = (args) => (
  <PrimaryTextInput {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

export const WithLabelAndPlaceholder = ArgsWrapper.bind({});
WithLabelAndPlaceholder.storyName = 'With label';
WithLabelAndPlaceholder.args = {
  label: 'Sample label',
  placeholder: 'Sample placeholder',
};

export const ReadOnly = ArgsWrapper.bind({});
ReadOnly.storyName = 'Read-only';
ReadOnly.args = {
  label: 'Sample label',
  defaultValue: 'Sample input',
  editable: false,
};

export const WithHelp = ArgsWrapper.bind({});
WithHelp.storyName = 'With help';
WithHelp.args = {
  label: 'Sample label',
  defaultValue: 'Sample input',
  helpMessage: 'Sample help',
};

export const WithError = ArgsWrapper.bind({});
WithError.storyName = 'With error';
WithError.args = {
  label: 'Sample label',
  defaultValue: 'Sample input',
  errorMessage: 'Sample error',
  helpMessage: 'Sample help',
};
