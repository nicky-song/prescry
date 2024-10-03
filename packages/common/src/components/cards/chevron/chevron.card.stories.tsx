// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { ChevronCard, IChevronCardProps } from './chevron.card';
import { View } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Cards/ChevronCard',
  component: ChevronCard,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<IChevronCardProps> = (args) => (
  <ChevronCard {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: (
    <View
      style={{
        height: 100,
        width: 200,
        backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BaseText>{'insert children here'}</BaseText>
    </View>
  ),
};
