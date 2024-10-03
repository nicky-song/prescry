// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { SubtitleText, ISubtitleTextProps } from './subtitle.text';

export default {
  title: 'Text/SubtitleText',
  component: SubtitleText,
  args: {},
};

const ArgsWrapper: Story<ISubtitleTextProps> = (args) => (
  <SubtitleText {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: 'Sample text',
};
