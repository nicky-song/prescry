// Copyright 2020 Prescryptive Health, Inc.

import {
  prescriptionValueCardStyles,
  IPrescriptionValueCardStyles,
} from './prescription-value.card.styles';
import { ViewStyle } from 'react-native';
import { FontSize, GreenScale, GreyScale } from '../../../../theming/theme';
import { Spacing } from '../../../../theming/spacing';
import { BorderRadius } from '../../../../theming/borders';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { GrayScaleColor } from '../../../../theming/colors';

describe('prescriptionValueCardStyles', () => {
  it('has expected styles', () => {
    const cardViewStyle: ViewStyle = {
      flexDirection: 'column',
      paddingTop: Spacing.times2,
      paddingRight: Spacing.times1pt25,
      paddingBottom: Spacing.times2,
      paddingLeft: Spacing.times1pt25,
      backgroundColor: GreyScale.lightest,
      borderTopWidth: 1,
      borderStyle: 'solid',
      borderColor: GrayScaleColor.borderLines,
      minHeight: '14vh',
    };

    const expectedStyles: IPrescriptionValueCardStyles = {
      borderContainerViewStyle: {
        ...cardViewStyle,
        borderColor: 'transparent',
        shadowColor: GreyScale.darkest,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 12,
      },
      pharmacyNameTextStyle: {
        marginBottom: Spacing.half,
        ...getFontFace({ weight: FontWeight.bold }),
      },
      cardViewStyle,
      leftColumnViewStyle: {
        flexDirection: 'column',
        flex: 4,
      },
      rightColumnViewStyle: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        flex: 2,
        marginLeft: Spacing.half,
        justifyContent: 'center',
      },
      rightColumnLabelTextStyle: { textAlign: 'right' },
      noPriceViewStyle: {
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
      noPriceTextStyle: { textAlign: 'center' },
      rowContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.threeQuarters,
      },
      youPayContainerViewStyle: {
        borderRadius: Spacing.half,
        backgroundColor: GreyScale.lightWhite,
        padding: Spacing.half,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      priceContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Spacing.half,
      },
      tagValueTextStyle: {
        color: GreenScale.medium,
        backgroundColor: GreenScale.lighter,
        padding: Spacing.quarter,
        paddingHorizontal: Spacing.half,
        width: 'fit-content',
        maxWidth: 'fit-content',
        marginBottom: Spacing.base,
        fontSize: FontSize.smallest,
        borderRadius: BorderRadius.half,
        marginRight: Spacing.half,
      },
      tagsContainerViewStyle: { marginBottom: Spacing.base },
      favoriteTagViewStyle: {
        marginBottom: Spacing.base,
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.half,
      },
      noteViewStyle: {
        marginTop: Spacing.base,
        color: GreyScale.lighterDark,
        fontSize: FontSize.small,
      },
      pricePlanTextStyle: { textAlign: 'right', flex: 2 },
      youPayTextStyle: {
        textAlign: 'right',
        flex: 2,
      },
      coPayTextStyle: {
        flexBasis: 'auto',
      },
      pricingOptionInformativePanelViewStyle: {
        marginBottom: Spacing.half,
      },
    };

    expect(prescriptionValueCardStyles).toEqual(expectedStyles);
  });
});
