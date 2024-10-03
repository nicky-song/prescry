// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { SkeletonBone, ISkeletonBoneProps } from './skeleton-bone';
import { ViewStyle } from 'react-native';

export default {
  title: 'Overlays/SkeletonBone',
  component: SkeletonBone,
};

const ArgsWrapper: Story<ISkeletonBoneProps> = (args) => (
  <SkeletonBone {...args} />
);

export const Default = ArgsWrapper.bind({});

const layoutViewStyleStory: ViewStyle = { width: '100%', height: '10vh' };

Default.args = {
  containerViewStyle: { flex: 1 },
  layoutViewStyleList: [layoutViewStyleStory],
};
