// Copyright 2021 Prescryptive Health, Inc.

import {
  createPinScreenStyles,
  ICreatePinScreenStyles,
} from './create-pin-screen.style';
import { ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { FontSize, GreyScale, PurpleScale } from '../../../theming/theme';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('createPinScreenStyles', () => {
  it('has expected styles', () => {
    const bodyContainerViewStyle: ViewStyle = {
      paddingBottom: 0,
      alignSelf: 'stretch',
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

    const screenInfoHeadingText: TextStyle = {
      color: GreyScale.lightDark,
      fontSize: FontSize.regular,
      ...getFontFace({ weight: FontWeight.medium }),
      lineHeight: 35,
      paddingBottom: Spacing.half,
    };

    const pinLabelText: TextStyle = {
      color: PurpleScale.darkest,
      fontSize: FontSize.ultra,
      ...getFontFace({ weight: FontWeight.medium }),
      margin: Spacing.times1pt5,
    };

    const buttonViewStyle: ViewStyle = {
      marginTop: Spacing.base,
    };

    const expectedStyles: ICreatePinScreenStyles = {
      bodyViewStyle,
      buttonViewStyle,
      headerView,
      pinLabelText,
      screenInfoHeadingText,
      bodyContainerViewStyle,
    };

    expect(createPinScreenStyles).toEqual(expectedStyles);
  });
});
