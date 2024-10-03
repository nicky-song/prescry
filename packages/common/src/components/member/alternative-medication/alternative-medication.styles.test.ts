// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  alternativeMedicationStyles,
  IAlternativeMedicationStyles,
} from './alternative-medication.styles';

describe('prescriptionDetailsStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAlternativeMedicationStyles = {
      prescriptionTagListViewStyle: {
        marginTop: Spacing.base,
      },
      prescriptionTitleViewStyle: {
        marginTop: Spacing.base,
      },
      pricingTextViewStyle: {
        marginTop: Spacing.base,
      },
      chevronCardViewStyle: {
        flexDirection: 'column',
      },
    };

    expect(alternativeMedicationStyles).toEqual(expectedStyles);
  });
});
