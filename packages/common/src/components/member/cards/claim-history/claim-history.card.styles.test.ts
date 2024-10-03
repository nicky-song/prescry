// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IClaimHistoryCardStyles,
  claimHistoryCardStyles,
} from './claim-history.card.styles';

describe('claimHistoryCardStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IClaimHistoryCardStyles = {
      rowContainerViewStyle: {
        flexDirection: 'row',
        columnGap: Spacing.base,
        marginTop: Spacing.half,
      },
      colContainerViewStyle: {
        flexDirection: 'column',
        columnGap: Spacing.base,
        marginTop: Spacing.half,
      },
      expandedPriceViewStyle: {
        marginTop: Spacing.times1pt5,
      },
      collapseFilledOnDateViewStyle: { marginBottom: Spacing.base },
    };

    expect(claimHistoryCardStyles).toEqual(expectedStyles);
  });
});
