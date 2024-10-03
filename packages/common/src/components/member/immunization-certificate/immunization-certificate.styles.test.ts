// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IImmunizationCertificateStyles,
  immunizationCertificateStyles,
} from './immunization-certificate.styles';

describe('immunizationCertificateStyles', () => {
  it('has expected styles', () => {
    const certificateContainerStyle: ViewStyle = {
      backgroundColor: GrayScaleColor.lightGray,
      borderColor: GrayScaleColor.borderLines,
      borderRadius: BorderRadius.half,
      borderStyle: 'solid',
      borderWidth: 2,
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      width: '100%',
      marginTop: Spacing.times1pt5,
      marginBottom: Spacing.times1pt5,
    };

    const certificateDetailsContainerStyle: ViewStyle = {
      marginLeft: Spacing.times1pt5,
      marginRight: Spacing.times1pt5,
    };

    const certificateTitleViewStyle: ViewStyle = {
      margin: Spacing.times1pt5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };

    const certificateTitleTextStyle: TextStyle = {
      fontSize: FontSize.large,
      ...getFontFace({ weight: FontWeight.bold }),
    };

    const recordItemView: ViewStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: Spacing.times1pt5,
    };

    const recordItemHeader: TextStyle = {
      ...getFontFace({ weight: FontWeight.semiBold }),
      fontSize: FontSize.small,
      marginBottom: Spacing.quarter,
    };

    const recordItemValue: TextStyle = {
      ...getFontFace({ weight: FontWeight.semiBold }),
      fontSize: FontSize.large,
    };

    const recordDetailsContainer: ViewStyle = {
      borderTopWidth: 2,
      borderTopColor: GrayScaleColor.borderLines,
      marginBottom: Spacing.times1pt5,
      display: 'flex',
      flexDirection: 'column',
    };

    const recordDetailsView: ViewStyle = {
      marginTop: Spacing.times1pt5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    };

    const expectedStyles: IImmunizationCertificateStyles = {
      certificateContainerViewStyle: certificateContainerStyle,
      certificateDetailsContainerViewStyle: certificateDetailsContainerStyle,
      certificateTitleViewStyle,
      certificateTitleTextStyle,
      recordItemViewStyle: recordItemView,
      recordItemHeaderTextStyle: recordItemHeader,
      recordItemValueTextStyle: recordItemValue,
      recordDetailsViewStyle: recordDetailsView,
      recordDetailsContainerViewStyle: recordDetailsContainer,
    };

    expect(immunizationCertificateStyles).toEqual(expectedStyles);
  });
});
