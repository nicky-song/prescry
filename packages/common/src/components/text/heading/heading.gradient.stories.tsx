// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { HeadingGradient, IHeadingGradientProps } from './heading.gradient';

export default {
  title: 'Text/HeaderGradient',
  component: HeadingGradient,
  args: { children: 'A pharmacy in your phone' },
};

const ArgsWrapper: Story<IHeadingGradientProps> = (args) => (
  <HeadingGradient {...args} />
);

export const Regular = ArgsWrapper.bind({});

export const CustomStyle = () => (
  <HeadingGradient>A pharmacy in your phone</HeadingGradient>
);
CustomStyle.storyName = 'Marketing sample';
