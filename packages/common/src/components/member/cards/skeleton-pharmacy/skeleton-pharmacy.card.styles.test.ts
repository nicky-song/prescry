// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  ISkeletonPharmacyCardStyles,
  skeletonPharmacyCardStyles,
} from './skeleton-pharmacy.card.styles';

describe('skeletonPharmacyCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISkeletonPharmacyCardStyles = {
      skeletonPharmacyCardViewStyle: {
        paddingTop: Spacing.times2,
        paddingBottom: Spacing.times2,
      },
      containerViewStyle: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      pharmacyNameViewStyle: {
        height: 27,
        width: 149,
        maxWidth: '95%',
      },
      pharmacyAddressViewStyle: {
        height: 24,
        width: 202,
        maxWidth: '95%',
        marginTop: Spacing.base,
      },
      distanceAndHoursViewStyle: {
        height: 24,
        width: 202,
        maxWidth: '95%',
        marginTop: Spacing.quarter,
      },
      priceViewStyle: {
        height: 48,
        width: 374,
        maxWidth: '100%',
        marginTop: Spacing.times1pt5,
      },
      firstBottomContentViewStyle: {
        height: 24,
        width: 342,
        maxWidth: '90%',
        marginTop: Spacing.threeQuarters,
        marginLeft: Spacing.base,
      },
      secondBottomContentViewStyle: {
        height: 24,
        width: 342,
        maxWidth: '90%',
        marginTop: Spacing.base,
        marginLeft: Spacing.base,
      },
      pharmacyTagListViewStyle: {
        marginBottom: Spacing.base,
      },
    };

    expect(skeletonPharmacyCardStyles).toEqual(expectedStyles);
  });
});
