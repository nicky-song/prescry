// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  IPharmacyInfoCardStyles,
  pharmacyInfoCardStyles,
} from './pharmacy-info.card.styles';

describe('pharmacyInfoCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPharmacyInfoCardStyles = {
      contentViewStyle: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        width: '100%',
      },
      pharmacyTagListViewStyle: {
        marginBottom: Spacing.base,
      },
      chevronCardViewStyle: {
        width: '100%',
      },
      pharmacyInfoViewStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
      },
      addressTextStyle: {
        ...getFontFace({ weight: FontWeight.bold }),
        marginBottom: Spacing.threeQuarters,
      },
    };

    expect(pharmacyInfoCardStyles).toEqual(expectedStyles);
  });
});
