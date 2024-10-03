// Copyright 2022 Prescryptive Health, Inc.

import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';
import {
  IPrescribedMedicationStyles,
  prescribedMedicationStyles,
} from './prescribed-medication.styles';

describe('prescribedMedicationStyles', () => {
  it('should contain expected styles', () => {
    const expectedStyles: IPrescribedMedicationStyles = {
      priceTextStyle: {
        ...getFontDimensions(FontSize.h3),
        justifyContent: 'space-between',
      },
      planPaysContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      titleTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        ...getFontDimensions(FontSize.small),
        marginBottom: Spacing.half,
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      youPayTextStyle: { ...getFontDimensions(FontSize.large) },
      sentToPharmacyTextStyle: {
        ...getFontDimensions(FontSize.small),
        width: '100%',
      },
      iconButtonTextStyle: {
        fontSize: IconSize.regular,
        marginBottom: -4,
      },
      iconButtonViewStyle: {
        height: 18,
        width: 18,
        marginLeft: Spacing.quarter,
      },
      estimatedPriceContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
    };

    expect(prescribedMedicationStyles).toEqual(expectedStyles);
  });
});
