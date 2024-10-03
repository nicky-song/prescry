// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { FontSize, GreyScale } from '../../../../theming/theme';
import { titleDescriptionCardItemStyle } from './title-description-card-item.style';

describe('titleDescriptionCardItemStyle', () => {
  it('has expected styles', () => {
    const fontColor = GrayScaleColor.primaryText;

    const cardViewStyle: ViewStyle = {
      alignItems: 'center',
      height: 'auto',
      padding: 18,
      borderRadius: 4,
      backgroundColor: GreyScale.lightWhite,
      borderWidth: 0,
      paddingLeft: 24,
      paddingTop: 18,
      paddingRight: 14,
      borderColor: GreyScale.lighterDark,
      flexDirection: 'row',
    };

    const titleTextStyle: TextStyle = {
      color: fontColor,
      fontSize: FontSize.larger,
      ...getFontFace({ weight: FontWeight.bold }),
      marginBottom: 10,
      textAlign: 'left',
    };

    const descriptionTextStyle: TextStyle = {
      color: fontColor,
      ...getFontFace(),
      textAlign: 'left',
      fontSize: FontSize.regular,
    };

    const textContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexGrow: 1,
      flex: 4,
    };

    const iconContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexBasis: 32,
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'flex-end',
      flex: 1,
    };

    const iconViewStyle: ViewStyle = { width: 18, height: 18 };

    const iconStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.larger,
    };

    const expectedStyles = {
      titleTextStyle,
      descriptionTextStyle,
      cardViewStyle,
      textContainerViewStyle,
      iconContainerViewStyle,
      iconViewStyle,
      iconStyle,
    };

    expect(titleDescriptionCardItemStyle).toEqual(expectedStyles);
  });
});
