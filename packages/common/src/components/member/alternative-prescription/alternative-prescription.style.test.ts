// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { FontSize, GreyScale } from '../../../theming/theme';
import { alternativePrescriptionStyles } from './alternative-prescription.style';

describe('claimAlertSavingDetailsStyle', () => {
  it('has expected styles', () => {
    const contentCommonView: ViewStyle = {
      flexDirection: 'row',
    };
    const drugNameView: ViewStyle = {
      flex: 2,
      alignContent: 'flex-start',
      marginTop: Spacing.times1pt25,
    };
    const startingFromView: ViewStyle = {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    };
    const startingFromText: TextStyle = {
      fontSize: FontSize.smaller,
      color: GreyScale.dark,
      textAlign: 'right',
    };
    const rowContainerView: ViewStyle = {
      flexGrow: 0,
      alignSelf: 'stretch',
      backgroundColor: GreyScale.lightest,
      borderBottomColor: GreyScale.lighter,
      borderBottomWidth: 5,
      paddingHorizontal: 20,
      paddingBottom: 10,
    };
    const priceView: ViewStyle = {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    };
    const alternativeDrugName: TextStyle = {
      ...getFontFace({ weight: FontWeight.bold }),
      fontSize: FontSize.regular,
      flex: 1,
      color: GreyScale.darkest,
      textAlign: 'left',
      paddingTop: 10,
    };
    const recommendationContentInfoView: ViewStyle = {
      ...contentCommonView,
      paddingBottom: 2,
    };
    const priceLabelText: TextStyle = {
      color: GreyScale.darkest,
      fontSize: FontSize.regular,
      ...getFontFace(),
    };
    const subContainerView: ViewStyle = {
      alignItems: 'flex-start',
      backgroundColor: GreyScale.lightest,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    };
    const planPayContainerView: ViewStyle = {
      ...subContainerView,
      paddingBottom: 12,
    };
    const youPayContainerView: ViewStyle = {
      ...subContainerView,
      paddingTop: 10,
    };
    const youPayText: TextStyle = {
      ...getFontFace(),
      color: GreyScale.darkest,
      fontSize: FontSize.regular,
      lineHeight: 30,
    };
    const youPayPriceText: TextStyle = {
      ...youPayText,
      ...getFontFace({ weight: FontWeight.bold }),
      color: GreyScale.darkest,
      textAlign: 'right',
    };
    const planPayPriceText: TextStyle = {
      ...priceLabelText,
      ...getFontFace({ weight: FontWeight.bold }),
      color: GreyScale.darkest,
      textAlign: 'right',
    };
    const drugInfoLinkView: ViewStyle = {
      flexDirection: 'row',
      maxWidth: '45%',
    };
    const drugInfoLinkIcon: TextStyle = {
      ...getFontFace(),
      fontSize: FontSize.large,
      color: PrimaryColor.darkBlue,
      paddingTop: 10,
    };

    const expectedStyles = {
      contentCommonView,
      alternativeDrugName,
      drugNameView,
      priceView,
      recommendationContentInfoView,
      rowContainerView,
      startingFromText,
      startingFromView,
      planPayPriceText,
      youPayPriceText,
      youPayContainerView,
      planPayContainerView,
      priceLabelText,
      youPayText,
      drugInfoLinkView,
      drugInfoLinkIcon,
    };

    expect(alternativePrescriptionStyles).toEqual(expectedStyles);
  });
});
