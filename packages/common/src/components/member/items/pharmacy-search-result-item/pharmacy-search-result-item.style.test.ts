// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  FontSize,
  GreyScale,
  LocalDimensions,
} from '../../../../theming/theme';
import { pharmacySearchResultListItemStyle } from './pharmacy-search-result-item.style';

describe('pharmacySearchResultListItemStyle', () => {
  it('has expected styles', () => {
    const headerTextStyle: TextStyle = {
      color: GrayScaleColor.primaryText,
      ...getFontFace({ weight: FontWeight.bold }),
      fontSize: FontSize.large,
      paddingTop: 0,
      paddingBottom: 16,
      alignItems: 'center',
      flex: LocalDimensions.width > 600 ? 3 : 2,
    };

    const textContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      alignItems: 'stretch',
      paddingLeft: 0,
      paddingRight: 8,
      paddingTop: 24,
      flexGrow: 1,
      flex: 3,
    };

    const pharmacyLocationsListCommonTextStyle: TextStyle = {
      color: GreyScale.lightDark,
      ...getFontFace(),
      textAlign: 'left',
      fontSize: FontSize.regular,
    };

    const addressTextStyle: TextStyle = {
      ...pharmacyLocationsListCommonTextStyle,
      color: GreyScale.darkest,
      marginBottom: 4,
      flexGrow: 0,
    };

    const priceTextStyle: TextStyle = {
      color: GrayScaleColor.primaryText,
      ...getFontFace({ weight: FontWeight.semiBold }),
      textAlign: 'right',
      paddingBottom: 16,
      marginRight: -Spacing.times1pt5,
    };

    const distanceTextStyle: TextStyle = {
      ...pharmacyLocationsListCommonTextStyle,
      flexGrow: 0,
      color: GreyScale.darkest,
    };

    const containerViewStyle: ViewStyle = {
      borderWidth: 0,
      flexDirection: 'row',
      overflow: 'hidden',
      display: 'flex',
      flex: 1,
      marginTop: 8,
      borderRadius: 4,
      paddingLeft: 24,
      paddingBottom: 24,
      backgroundColor: GreyScale.lightWhite,
    };

    const addressContainerViewStyle: ViewStyle = {
      flexGrow: 0,
      paddingRight: 0,
    };

    const priceViewStyle: ViewStyle = {
      flexDirection: 'row',
      display: 'flex',
    };

    const iconContainerViewStyle: ViewStyle = {
      flexDirection: 'column',
      display: 'flex',
      flexBasis: 48,
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginTop: 24,
    };

    const iconStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.larger,
    };

    const iconViewStyle: ViewStyle = { width: 18, height: 18, maxHeight: 18 };

    const phoneTextStyle: TextStyle = {
      ...pharmacyLocationsListCommonTextStyle,
      color: GreyScale.darkest,
      marginBottom: 4,
      flexGrow: 0,
    };

    const expectedStyles = {
      headerTextStyle,
      addressTextStyle,
      phoneTextStyle,
      distanceTextStyle,
      priceViewStyle,
      containerViewStyle,
      textContainerViewStyle,
      addressContainerViewStyle,
      iconContainerViewStyle,
      iconStyle,
      iconViewStyle,
      priceTextStyle,
    };

    expect(pharmacySearchResultListItemStyle).toEqual(expectedStyles);
  });
});
