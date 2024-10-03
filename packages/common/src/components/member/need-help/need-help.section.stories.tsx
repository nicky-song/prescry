// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { NeedHelpSection, INeedHelpSectionProps } from './need-help.section';

export default {
  title: 'Support/NeedHelpSection',
  component: NeedHelpSection,
};

const ArgsWrapper: Story<INeedHelpSectionProps> = (args) => (
  <NeedHelpSection {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
