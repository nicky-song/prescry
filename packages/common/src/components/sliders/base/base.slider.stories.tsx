// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { Story } from '@storybook/react';
import { BaseSlider, IBaseSliderProps } from './base.slider';

export default {
  title: 'sliders/BaseSlider',
  component: BaseSlider,
  argTypes: {
    onSelectedValue: { action: 'pressed' },
  },
};

const ArgsWrapper: Story<IBaseSliderProps> = (args: IBaseSliderProps) => (
  <View style={{ padding: 24, margin: -16 }}>
    <BaseSlider {...args} />
  </View>
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  defaultPosition: 25,
  minimumPosition: 1,
  maximumPosition: 100,
  unit: 'mi',
  showCurrentValue: true,
};
