// Copyright 2021 Prescryptive Health, Inc.

import {
  offeredServiceStyle,
  IOfferedServiceStyles,
  offeredServiceDesktopStyles,
} from './offered-service.styles';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';

describe('offeredServiceStyles', () => {
  it('has expected default styles', () => {
    const buttonViewStyle: ViewStyle = {
      alignSelf: 'flex-end',
      marginTop: Spacing.eighth,
    };

    const serviceTitleTextStyle: TextStyle = {
      paddingBottom: 0,
      paddingTop: Spacing.half,
      ...getFontDimensions(FontSize.large),
      ...getFontFace({ family: 'Poppins', weight: FontWeight.semiBold }),
    };

    const serviceIconViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      maxHeight: 64,
      maxWidth: 64,
      alignSelf: 'flex-start',
      marginRight: Spacing.base,
      marginBottom: 0,
    };

    const serviceDescriptionViewStyle: ViewStyle = {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: Spacing.times1pt5,
      paddingBottom: Spacing.times1pt5,
      paddingLeft: Spacing.base,
      paddingRight: Spacing.base,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: GrayScaleColor.borderLines,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: GrayScaleColor.borderLines,
      shadowRadius: 2,
      borderRadius: BorderRadius.normal,
      backgroundColor: GrayScaleColor.white,
    };

    const serviceContentViewStyle: ViewStyle = {
      display: 'flex',
      flex: 1,
    };

    const serviceDescriptionDesktopViewStyle: ViewStyle = {
      ...serviceDescriptionViewStyle,
      flexDirection: 'row',
      paddingTop: Spacing.times2,
      paddingBottom: Spacing.times2,
      paddingLeft: Spacing.times1pt5,
      paddingRight: Spacing.times1pt5,
    };

    const dropDownArrowImage: ImageStyle = {
      flexGrow: 0,
      height: IconSize.small,
      marginTop: 2,
      marginLeft: 7,
      width: IconSize.small,
    };

    const chevronDownBlueImage: ImageStyle = {
      ...dropDownArrowImage,
    };

    const visibleContainerStyle: ViewStyle = {
      paddingLeft: Spacing.threeQuarters,
      paddingRight: Spacing.threeQuarters,
      display: 'flex',
    };

    const visibleContainerDesktopStyle: ViewStyle = {
      paddingLeft: 0,
      paddingRight: 0,
      display: 'flex',
    };

    const hiddenContainerStyle: ViewStyle = {
      display: 'none',
    };

    const responsiveContainerViewStyle: ViewStyle = {
      flexDirection: 'row',
      marginTop: 0,
      marginBottom: Spacing.base,
      height: 'auto',
    };

    const responsiveContainerDesktopViewStyle: ViewStyle = {
      ...responsiveContainerViewStyle,
      height: 'auto',
    };

    const labelContainerViewStyle: ViewStyle = {
      alignSelf: 'flex-start',
      height: 15,
      marginTop: Spacing.threeQuarters,
      marginRight: 6,
      maxWidth: 20,
      maxHeight: 20,
    };

    const labelContainerDesktopViewStyle: ViewStyle = {
      ...labelContainerViewStyle,
    };

    const iconImageStyle: ImageStyle = {
      height: 64,
      width: 64,
      marginTop: Spacing.threeQuarters,
    };

    const flexViewStyle: ViewStyle = {
      flex: 1,
      height: 'fit-content',
    };

    const serviceTextTextStyle: TextStyle = {
      marginTop: Spacing.threeQuarters,
      width: 'calc(90% + 36px)',
    };

    const expectedMobileStyles: IOfferedServiceStyles = {
      buttonViewStyle,
      serviceTextTextStyle,
      dropDownArrowImage,
      chevronDownBlueImage,
      flexViewStyle,
      hiddenContainerStyle,
      iconImageStyle,
      labelContainerViewStyle,
      responsiveContainerViewStyle,
      visibleContainerStyle,
      serviceDescriptionViewStyle,
      serviceDescriptionDesktopViewStyle,
      serviceContentViewStyle,
      serviceIconViewStyle,
      serviceTitleTextStyle,
    };

    const expectedDesktopStyles: IOfferedServiceStyles = {
      ...offeredServiceStyle,
      visibleContainerStyle: visibleContainerDesktopStyle,
      labelContainerViewStyle: labelContainerDesktopViewStyle,
      responsiveContainerViewStyle: responsiveContainerDesktopViewStyle,
      serviceDescriptionViewStyle: serviceDescriptionDesktopViewStyle,
      chevronDownBlueImage,
    };

    expect(offeredServiceStyle).toEqual(expectedMobileStyles);
    expect(offeredServiceDesktopStyles).toEqual(expectedDesktopStyles);
  });
});
