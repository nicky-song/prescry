// Copyright 2021 Prescryptive Health, Inc.

import {
  pinScreenContainerStyles,
  IPinScreenContainerStyles,
} from './pin-screen-container.styles';
import { FontSize, RedScale } from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { ViewStyle, TextStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';

describe('pinScreenContainerStyles', () => {
  it('has expected styles', () => {
    const containerViewStyle: ViewStyle = {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    };

    const errorTextStyle: TextStyle = {
      color: RedScale.regular,
      fontSize: FontSize.small,
      ...getFontFace(),
      lineHeight: 17,
      marginTop: Spacing.half,
      textAlign: 'center',
    };

    const pinKeypadStyle: ViewStyle = {
      flex: 1,
      flexDirection: 'column',
      marginTop: Spacing.threeQuarters,
    };

    const expectedStyles: IPinScreenContainerStyles = {
      containerViewStyle,
      errorTextStyle,
      pinKeypadStyle,
    };

    expect(pinScreenContainerStyles).toEqual(expectedStyles);
  });
});
