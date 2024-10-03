// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { DrugNameText, IDrugNameTextProps } from './drug-name-text';
export default {
  title: 'Text/DrugNameText',
  component: DrugNameText,
  argTypes: { drugName: 'Sample', input: 'Sam' },
};

const ArgsWrapper: Story<IDrugNameTextProps> = (args) => (
  <DrugNameText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
