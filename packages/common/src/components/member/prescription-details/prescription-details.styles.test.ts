// Copyright 2022 Prescryptive Health, Inc.

import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { prescriptionDetailsStyles } from './prescription-details.styles';

describe('prescriptionDetailsStyles', () => {
  it('has expected styles', () => {
    const expectedStyles = {
      titleTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        fontSize: FontSize.small,
      },
      prescriptionTagListViewStyle: {
        marginTop: Spacing.base,
      },
      prescriptionTitleViewStyle: {
        marginTop: Spacing.base,
      },
      pricingTextViewStyle: {
        marginTop: Spacing.base,
      },
    };

    expect(prescriptionDetailsStyles).toEqual(expectedStyles);
  });
});
