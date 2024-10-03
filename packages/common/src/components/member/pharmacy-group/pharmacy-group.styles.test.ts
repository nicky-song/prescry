// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPharmacyGroupStyles,
  pharmacyGroupStyles,
} from './pharmacy-group.styles';

describe('pharmacyGroupStyles', () => {
  it('has expected styles', () => {
    const expectedPharmacyGroupStyles: IPharmacyGroupStyles = {
      pharmacyGroupViewStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      pharmacyInfoCardParentViewStyle: {
        width: '100%',
        marginTop: Spacing.threeQuarters,
        paddingLeft: Spacing.times2,
      },
      lineSeparatorViewStyle: {
        marginTop: Spacing.threeQuarters,
        marginRight: Spacing.times2,
      },
      pharmacyInfoCardViewStyle: { marginVertical: Spacing.base },
    };

    expect(pharmacyGroupStyles).toEqual(expectedPharmacyGroupStyles);
  });
});
