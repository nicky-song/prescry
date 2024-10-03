// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { Story } from '@storybook/react';
import { DistanceSlider, IDistanceSliderProps } from './distance.slider';

export default {
  title: 'sliders/DistanceSlider',
  component: DistanceSlider,
  argTypes: {
    onSelectedValue: { action: 'pressed' },
  },
};

const ArgsWrapper: Story<IDistanceSliderProps> = (
  args: IDistanceSliderProps
) => (
  <View style={{ padding: 24, margin: -16 }}>
    <DistanceSlider {...args} />
  </View>
);

export const Default = ArgsWrapper.bind({});
Default.args = {};
