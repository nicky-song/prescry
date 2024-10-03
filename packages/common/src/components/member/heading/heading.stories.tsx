// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { Story } from '@storybook/react';
import { Heading, IHeadingProps } from './heading';
import { View } from 'react-native';

export default {
  title: 'Text/Heading',
  component: Heading,
};

const ArgsWrapper: Story<IHeadingProps> = (args) => (
  <Heading {...args}>Sample heading</Heading>
);

export const Default = ArgsWrapper.bind({});
Default.storyName = 'One heading (default)';

const AllHeadingsWrapper: Story<IHeadingProps> = () => {
  const headings: ReactNode[] = [];

  for (let level = 1; level <= 3; ++level) {
    const headingText = `Sample heading ${level}`;
    headings.push(<Heading level={level}>{headingText}</Heading>);
  }

  return <View>{headings}</View>;
};

export const AllHeadings = AllHeadingsWrapper.bind({});
AllHeadings.storyName = 'All headings';
