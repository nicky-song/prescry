// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { FontSize, GreyScale, BlueScale } from '../../../../theming/theme';
import { titlePropertiesItemStyle } from './title-properties-item.styles';

describe('titlePropertiesItemStyle', () => {
  it('has expected styles', () => {
    const cardViewStyle: ViewStyle = {
      alignItems: 'center',
      height: 'auto',
      borderRadius: 0,
      backgroundColor: GreyScale.lightest,
      borderWidth: 0,
      borderBottomWidth: 1,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 12,
      borderColor: GreyScale.lighterDark,
      flexDirection: 'row',
      marginTop: 0,
    };

    const labelContentViewStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginVertical: 7,
    };

    const labelTextStyle: TextStyle = {
      flex: 1,
      color: GreyScale.dark,
      fontSize: FontSize.regular,
      ...getFontFace(),
    };

    const contentTextStyle: TextStyle = {
      flex: 3,
      color: GreyScale.darkest,
      fontSize: FontSize.regular,
      ...getFontFace({ weight: FontWeight.semiBold }),
    };

    const titleTextStyle: TextStyle = {
      color: BlueScale.darker,
      ...getFontFace({ weight: FontWeight.bold }),
      textAlign: 'left',
      alignItems: 'center',
    };

    const textContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexGrow: 1,
      flex: 1,
    };

    const iconContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexBasis: 32,
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'center',
    };

    const iconViewStyle: ViewStyle = {
      width: 26,
      height: 26,
      maxHeight: 26,
      alignItems: 'flex-end',
    };

    const iconStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.larger,
    };

    const expectedStyles = {
      titleTextStyle,
      cardViewStyle,
      textContainerViewStyle,
      iconContainerViewStyle,
      iconViewStyle,
      iconStyle,
      labelContentViewStyle,
      labelTextStyle,
      contentTextStyle,
    };

    expect(titlePropertiesItemStyle).toEqual(expectedStyles);
  });
});
