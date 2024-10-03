// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  LocationTextInput,
  ILocationTextInputProps,
} from './location-text.input';

export default {
  title: 'Inputs/LocationTextInput',
  component: LocationTextInput,
  argTypes: {
    onChangeText: { action: 'onChangeText' },
    onLocationPress: { action: 'onLocationPress' },
  },
};

const ArgsWrapper: Story<ILocationTextInputProps> = (args) => (
  <LocationTextInput {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

export const WithLabelAndPlaceholder = ArgsWrapper.bind({});
WithLabelAndPlaceholder.storyName = 'With label';
WithLabelAndPlaceholder.args = {
  placeholder: 'Sample placeholder',
};

export const WithError = ArgsWrapper.bind({});
WithError.storyName = 'With error';
WithError.args = {
  defaultValue: 'Sample input',
  errorMessage: 'Sample error',
};
