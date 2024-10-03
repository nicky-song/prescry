// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  FontSize,
  getDimension,
  GreyScale,
  LocalDimensions,
  PurpleScale,
  RedScale,
} from '../../../theming/theme';
import { getContainerHeightMinusHeader } from '../../../utils/responsive-screen.helper';
import { verifyIdentitySendCodeScreenStyle } from './verify-identity-send-code-screen.style';

describe('verifyIdentitySendCodeScreenStyle', () => {
  it('has expected styles', () => {
    const headerViewStyle: ViewStyle = {
      alignItems: 'flex-start',
      alignSelf: 'center',
      marginHorizontal: Spacing.half,
      width: getDimension(LocalDimensions.maxWidth, 'width', 0.85),
    };

    const headerTextStyle: TextStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.ultra,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'left',
      marginTop: Spacing.times1pt5,
      marginBottom: Spacing.times1pt25,
    };

    const bodyContainer: ViewStyle = {
      flexDirection: 'column',
    };

    const toggleContainerViewStyle: ViewStyle = {
      alignItems: 'flex-start',
      flex: 1,
      overflow: 'hidden',
      marginTop: Spacing.times1pt5,
      width: '100%',
    };

    const toggleViewStyle: ViewStyle = {
      flexGrow: 1,
      flexDirection: 'column',
      width: '100%',
    };

    const buttonViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.times2,
    };

    const errorContainerViewStyle: ViewStyle = {
      alignItems: 'flex-start',
      flex: 1,
      overflow: 'hidden',
      width: '100%',
    };

    const errorText: TextStyle = {
      paddingTop: 5,
      fontSize: FontSize.small,
      ...getFontFace(),
      color: RedScale.regular,
      maxWidth: 'fit-content',
    };

    const basicPageHeaderView: ViewStyle = {
      alignItems: 'stretch',
      alignSelf: 'stretch',
      backgroundColor: PurpleScale.lighter,
      flexGrow: 1,
    };
    const basicPageBodyView: ViewStyle = {
      alignContent: 'center',
      alignSelf: 'stretch',
      flexGrow: 1,
    };

    const containerViewStyle: ViewStyle = {
      justifyContent: 'space-between',
      height: getContainerHeightMinusHeader(),
      paddingBottom: Spacing.times4,
      paddingLeft: Spacing.times1pt5,
      paddingRight: Spacing.times1pt5,
    };

    const contentContainerViewStyle: ViewStyle = { maxHeight: 280 };

    const expectedStyles = {
      basicPageBodyView,
      basicPageHeaderView,
      containerViewStyle,
      contentContainerViewStyle,
      headerViewStyle,
      headerTextStyle,
      bodyContainer,
      toggleContainerViewStyle,
      toggleViewStyle,
      buttonViewStyle,
      errorContainerViewStyle,
      errorText,
    };

    expect(verifyIdentitySendCodeScreenStyle).toEqual(expectedStyles);
  });
});
