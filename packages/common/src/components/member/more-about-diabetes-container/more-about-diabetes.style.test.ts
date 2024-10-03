// Copyright 2020 Prescryptive Health, Inc.

import { moreAboutDiabetesStyle } from './more-about-diabetes.style';
import {
  BlueScale,
  FontSize,
  getDimension,
  GreyScale,
  LocalDimensions,
} from '../../../theming/theme';
import { Spacing } from '../../../theming/spacing';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('moreAboutDiabetesStyle', () => {
  it('has expected styles', () => {
    const moreAboutDiabetesContainer: ViewStyle = {
      height: 'auto',
      padding: 0,
    };

    const moreAboutDiabetesView: ViewStyle = {
      flexDirection: 'column',
      height: 'auto',
      paddingLeft: Spacing.times1pt25,
      paddingRight: Spacing.times1pt25,
      paddingTop: Spacing.threeQuarters,
      paddingBottom: Spacing.threeQuarters,
    };

    const headerContainer: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'flex-start',
      height: 'auto',
      paddingTop: Spacing.times1pt25,
      paddingBottom: Spacing.times1pt25,
    };
    const expandingContainer: ViewStyle = {
      alignSelf: 'stretch',
      alignItems: 'stretch',
      flexDirection: 'row',
    };
    const expandingIcon: TextStyle = {
      color: BlueScale.darker,
      flex: 1,
      fontSize: FontSize.largest,
      ...getFontFace({ weight: FontWeight.medium }),
      textAlign: 'right',
      justifyContent: 'flex-end',
    };
    const headerText: TextStyle = {
      color: GreyScale.dark,
      flex: 1,
      fontSize: FontSize.large,
      ...getFontFace({ weight: FontWeight.medium }),
      textAlign: 'left',
      minWidth: getDimension(LocalDimensions.maxWidth, 'width', 0.75),
    };

    const lineSeparatorViewStyle: ViewStyle = {
      marginTop: Spacing.quarter,
    };

    const videoLinkContainer: ViewStyle = {
      paddingTop: Spacing.times1pt25,
      paddingBottom: Spacing.times1pt25,
      height: 'auto',
    };

    const videoContainer: ViewStyle = {
      height: 'auto',
    };

    const imageStyle: ImageStyle = {
      flex: 1,
      width: '100%',
      resizeMode: 'cover',
      minHeight: getDimension(LocalDimensions.height, 'height', 0.25),
    };

    const videoViewStyle: ViewStyle = {
      flex: 1,
      width: '100%',
      minHeight: getDimension(LocalDimensions.height, 'height', 0.26),
      borderWidth: 0,
    };

    const expectedMoreAboutDiabetesStyle = {
      expandingContainer,
      expandingIcon,
      headerContainer,
      headerText,
      imageStyle,
      lineSeparatorViewStyle,
      moreAboutDiabetesContainer,
      moreAboutDiabetesView,
      videoContainer,
      videoLinkContainer,
      videoViewStyle,
    };

    expect(moreAboutDiabetesStyle).toEqual(expectedMoreAboutDiabetesStyle);
  });
});
