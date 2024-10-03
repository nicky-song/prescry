// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ILineSeparatorProps, LineSeparator } from './line-separator';
import { Spacing } from '../../../theming/spacing';

export default {
  title: 'Layout/LineSeparator',
  component: LineSeparator,
};

const ArgsWrapper: Story<ILineSeparatorProps> = (args) => (
  <LineSeparator {...args} />
);

export const WithTopBottomMargins = ArgsWrapper.bind({});
WithTopBottomMargins.storyName = 'With specific margins';

WithTopBottomMargins.args = {
  viewStyle: {
    marginTop: Spacing.times1pt25,
    marginBottom: Spacing.times1pt25,
  },
  label: 'Switching to',
};
