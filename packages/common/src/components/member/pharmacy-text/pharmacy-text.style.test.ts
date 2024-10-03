// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { pharmacyTextStyles, IPharmacyTextStyles } from './pharmacy-text.style';

describe('prescriptionDetailsStyles', () => {
  it('should contain expected styles', () => {
    const expectedStyles: IPharmacyTextStyles = {
      descriptionTextStyle: {
        marginTop: Spacing.threeQuarters,
      },
      parentViewStyle: {
        marginBottom: 0,
      },
      headingViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: Spacing.threeQuarters,
      },
      favoriteIconButtonViewStyle: { marginLeft: Spacing.base },
    };

    expect(pharmacyTextStyles).toEqual(expectedStyles);
  });
});
