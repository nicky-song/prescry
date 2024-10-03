// Copyright 2021 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../../theming/fonts';
import { Spacing } from '../../../../../theming/spacing';
import { RedScale } from '../../../../../theming/theme';
import {
  findYourPharmacyStyle,
  IFindPharmacyScreenStyle,
} from './find-your-pharmacy.screen.style';

describe('findYourPharmacyStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IFindPharmacyScreenStyle = {
      headerViewStyle: { paddingBottom: 0 },
      findPharmacyTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        marginBottom: Spacing.base,
      },
      findPharmacySubTextStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      pharmacyResultViewStyle: {
        alignItems: 'stretch',
        flexDirection: 'column',
        marginTop: Spacing.base,
        minHeight: 160,
      },
      displayMoreButtonViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.times1pt5,
      },
      errorMessageTextStyle: {
        marginTop: Spacing.base,
        color: RedScale.regular,
      },
    };

    expect(findYourPharmacyStyle).toEqual(expectedStyle);
  });
});
