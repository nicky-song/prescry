// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  ToggleButtonGroup,
  IToggleButtonGroupProps,
} from './toggle.button-group';

export default {
  title: 'Buttons/ToggleButtonGroup',
  component: ToggleButtonGroup,
  argTypes: {
    onSelect: { action: 'onSelect' },
  },
  args: {},
};

const ArgsWrapper: Story<IToggleButtonGroupProps> = (args) => (
  <ToggleButtonGroup {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  headerText: 'Form',
  options: [
    { value: '100', label: 'Bottle' },
    { value: '101', label: 'Capsule' },
    { value: '102', label: 'Tablet' },
    { value: '103', label: 'Pill' },
    { value: '104', label: 'Set' },
  ],
  isRequired: true,
};

export const InitialSelection = ArgsWrapper.bind({});
InitialSelection.storyName = 'Second button selected';
InitialSelection.args = {
  headerText: 'Form',
  options: [
    { value: '100', label: 'Bottle' },
    { value: '101', label: 'Capsule' },
    { value: '102', label: 'Tablet' },
    { value: '103', label: 'Pill' },
    { value: '104', label: 'Set' },
  ],
  selected: '101',
};
