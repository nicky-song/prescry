// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { DatePicker, IDatePickerProps } from './date.picker';

export default {
  title: 'Pickers/DatePicker',
  component: DatePicker,
  argTypes: {
    getSelectedDate: { action: 'getSelectedDate' },
  },
};

const ArgsWrapper: Story<IDatePickerProps> = (args) => <DatePicker {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {};

export const WithLabel = ArgsWrapper.bind({});
WithLabel.args = {
  label: 'Sample label',
  isRequired: false,
};
