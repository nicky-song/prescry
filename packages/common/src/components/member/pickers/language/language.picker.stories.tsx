// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { LanguagePicker } from './language.picker';

export default {
  title: 'Pickers/LanguagePicker',
  component: LanguagePicker,
};

const ArgsWrapper: Story = () => <LanguagePicker />;

export const Default = ArgsWrapper.bind({});
Default.args = {};
