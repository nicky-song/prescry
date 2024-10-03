// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../../theming/spacing';
import { FontSize } from '../../../../../../../theming/theme';
import {
  IPrescriptionAtThisPharmacySectionStyles,
  prescriptionAtThisPharmacySectionStyles,
} from './prescription-at-this-pharmacy.section.styles';

describe('prescriptionAtThisPharmacySectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrescriptionAtThisPharmacySectionStyles = {
      headingTextStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      buttonViewStyle: {
        marginTop: Spacing.times1pt5,
        alignSelf: 'center',
      },
      smartPriceCardViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      informationTextStyle: {
        fontSize: FontSize.small,
        alignSelf: 'center',
      },
      paddingViewStyle: {
        paddingRight: Spacing.times1pt5,
        paddingLeft: Spacing.times1pt5,
        paddingBottom: Spacing.times1pt5,
        paddingTop: Spacing.times1pt5,
      },
      rxIdCardViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
    };

    expect(prescriptionAtThisPharmacySectionStyles).toEqual(expectedStyles);
  });
});
