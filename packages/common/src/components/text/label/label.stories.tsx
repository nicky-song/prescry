// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { Label, ILabelProps } from './label';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';

const onChangeText = () => true;

export default {
  title: 'Text/Label',
  component: Label,
  args: {},
};

const ArgsWrapper: Story<ILabelProps> = (args) => <Label {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  label: 'Sample label',
  children: (
    <PrimaryTextInput textContentType='name' onChangeText={onChangeText} />
  ),
};

export const Required = ArgsWrapper.bind({});
Required.args = {
  label: 'Sample label',
  isRequired: true,
  children: (
    <PrimaryTextInput textContentType='name' onChangeText={onChangeText} />
  ),
};
