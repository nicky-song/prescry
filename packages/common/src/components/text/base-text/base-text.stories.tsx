// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { BaseText, IBaseTextProps } from './base-text';

export default {
  title: 'Text/BaseText',
  component: BaseText,
  args: { children: 'Sample text' },
};

const ArgsWrapper: Story<IBaseTextProps> = (args) => <BaseText {...args} />;

export const Regular = ArgsWrapper.bind({});

export const CustomStyle = () => (
  <BaseText style={{ color: 'blue', fontSize: 48 }}>Custom style</BaseText>
);
CustomStyle.storyName = 'Custom style';
