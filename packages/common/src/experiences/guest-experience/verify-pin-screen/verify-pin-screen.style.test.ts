// Copyright 2021 Prescryptive Health, Inc.

import {
  verifyPinScreenStyles,
  IVerifyPinScreenStyles,
} from './verify-pin-screen.style';
import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { FontSize, GreyScale, PurpleScale } from '../../../theming/theme';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('verifyPinScreenStyles', () => {
  it('has expected styles', () => {
    const bodyContainerViewStyle: ViewStyle = {
      paddingBottom: 0,
      alignSelf: 'stretch',
    };

    const buttonViewStyle: ViewStyle = {
      marginTop: Spacing.base,
    };

    const bodyViewStyle: ViewStyle = {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      marginLeft: Spacing.times1pt5,
      marginRight: Spacing.times1pt5,
      marginBottom: Spacing.times1pt5,
    };

    const headerView: ViewStyle = {
      alignItems: 'stretch',
      alignSelf: 'stretch',
      flexGrow: 0,
    };

    const pinLabelText: TextStyle = {
      color: PurpleScale.darkest,
      fontSize: FontSize.ultra,
      ...getFontFace({ weight: FontWeight.medium }),
      lineHeight: 35,
      margin: Spacing.times1pt5,
    };

    const screenInfoHeadingText: TextStyle = {
      color: GreyScale.lightDark,
      fontSize: FontSize.regular,
      ...getFontFace({ weight: FontWeight.medium }),
      lineHeight: 35,
      paddingBottom: Spacing.half,
    };

    const expectedStyles: IVerifyPinScreenStyles = {
      bodyViewStyle,
      buttonViewStyle,
      headerView,
      pinLabelText,
      screenInfoHeadingText,
      bodyContainerViewStyle,
    };

    expect(verifyPinScreenStyles).toEqual(expectedStyles);
  });
});
