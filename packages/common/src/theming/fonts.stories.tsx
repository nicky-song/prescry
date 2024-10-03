// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Story } from '@storybook/react';
import { FontFamilyName, FontSize, getFontFace } from './fonts';

// eslint-disable-next-line storybook/csf-component
export default {
  title: 'Theme/Fonts',
};

interface IWrapperArgs {
  familyName: FontFamilyName;
  sampleText: string;
}

const sampleTextViewStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const Wrapper: Story<IWrapperArgs> = ({ familyName, sampleText }) => {
  const entries = Object.entries(FontSize).filter(
    (keyValue) => !isNaN(Number(keyValue[1]))
  );
  const samples = entries.map((keyValue) => {
    const size = keyValue[1];
    const name = keyValue[0];

    return (
      <View key={name} style={sampleTextViewStyle}>
        <Text numberOfLines={1} ellipsizeMode='tail'>
          {name} ({size}) -{' '}
        </Text>
        <Text
          style={{
            ...getFontFace({ family: familyName }),
            fontSize: size as FontSize,
          }}
        >
          {sampleText}
        </Text>
      </View>
    );
  });

  return <View>{samples}</View>;
};

const text = 'The quick brown fox jumped over the lazy dogs.';

export const OpenSans = Wrapper.bind({});
OpenSans.args = { familyName: 'OpenSans', sampleText: text };

export const Poppins = Wrapper.bind({});
Poppins.args = { familyName: 'Poppins', sampleText: text };
