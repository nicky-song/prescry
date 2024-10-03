// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';
import { BlueScale, FontSize } from '../../../theming/theme';
import { distancePickerStyles } from './distance-picker-style';

describe('distancePickerStyles', () => {
  it('has expected styles', () => {
    const distancePickerTextStyle: TextStyle = {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      opacity: 0,
    };

    const distancePickerContainer: ViewStyle = {
      flexGrow: 0,
      flexDirection: 'row',
    };

    const distancePickerContainerStyle: ViewStyle = {
      position: 'absolute',
    };

    const distancePickerSelectedValueTextStyle: TextStyle = {
      color: BlueScale.darker,
      fontSize: FontSize.regular,
      ...getFontFace(),
    };

    const distancePickerSelectedValueViewStyle: ViewStyle = {
      flexGrow: 0,
      alignContent: 'flex-start',
    };

    const distancePickerViewStyle: ViewStyle = {
      flexGrow: 0,
      paddingTop: 3,
      paddingLeft: 3,
    };

    const expectedStyles = {
      distancePickerContainer,
      distancePickerContainerStyle,
      distancePickerTextStyle,
      distancePickerSelectedValueTextStyle,
      distancePickerSelectedValueViewStyle,
      distancePickerViewStyle,
    };

    expect(distancePickerStyles).toEqual(expectedStyles);
  });
});
