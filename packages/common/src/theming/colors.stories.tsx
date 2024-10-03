// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, Text } from 'react-native';
import { Story } from '@storybook/react';
import { GrayScaleColor, NotificationColor, PrimaryColor } from './colors';

// eslint-disable-next-line storybook/csf-component
export default {
  title: 'Theme/Colors',
};

interface IWrapperArgs {
  colorEnum: Record<string, string>;
}

const blackTextColors = [
  PrimaryColor.lightPurple,
  PrimaryColor.lightPlum,
  PrimaryColor.lightBlue,
  GrayScaleColor.white,
  GrayScaleColor.disabledGray,
  GrayScaleColor.lightGray,
  GrayScaleColor.borderLines,
  NotificationColor.lightGreen,
  NotificationColor.lightYellow,
  NotificationColor.lightRed,
  NotificationColor.lightRatings,
  NotificationColor.heartRed,
];

const Wrapper: Story<IWrapperArgs> = ({ colorEnum }) => {
  const entries = Object.entries(colorEnum);

  const swatches = entries.map((keyValue) => {
    const value = keyValue[1] as
      | PrimaryColor
      | GrayScaleColor
      | NotificationColor;
    const name = keyValue[0];
    const textColor = blackTextColors.indexOf(value) === -1 ? 'white' : 'black';

    return (
      <View
        key={name}
        style={{
          width: 200,
          height: 200,
          backgroundColor: value,
          margin: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: textColor, fontWeight: 'bold' }}>
          {name} ({value.toLocaleLowerCase()})
        </Text>
      </View>
    );
  });

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{swatches}</View>
  );
};

export const Primary = Wrapper.bind({});
Primary.args = { colorEnum: PrimaryColor };

export const GrayScale = Wrapper.bind({});
GrayScale.storyName = 'Gray scale';
GrayScale.args = { colorEnum: GrayScaleColor };

export const Notification = Wrapper.bind({});
Notification.storyName = 'Alert & notification';
Notification.args = { colorEnum: NotificationColor };
