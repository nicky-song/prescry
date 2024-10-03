// Copyright 2022 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  claimPharmacyInfoStyles,
  IClaimPharmacyInfoStyles,
} from './claim-pharmacy-info.styles';

describe('claimPharmacyInfoStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IClaimPharmacyInfoStyles = {
      rowViewStyle: {
        flexDirection: 'row',
        marginBottom: Spacing.threeQuarters,
        alignItems: 'center',
      },
      iconTextStyle: {
        marginRight: Spacing.threeQuarters,
        color: PrimaryColor.darkBlue,
      },
      titleTextStyle: {
        marginBottom: Spacing.half,
      },
      favoriteIconButtonViewStyle: {
        marginLeft: Spacing.base,
        marginBottom: Spacing.half,
      },
    };

    expect(claimPharmacyInfoStyles).toEqual(expectedStyles);
  });
});
