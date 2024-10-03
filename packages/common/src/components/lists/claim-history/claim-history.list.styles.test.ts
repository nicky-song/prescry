// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IClaimHistoryListStyles,
  claimHistoryListStyles,
} from './claim-history.list.styles';

describe('claimHistoryListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IClaimHistoryListStyles = {
      cardViewStyle: {
        marginTop: Spacing.times1pt25,
      },
      firstCardViewStyle: {},
    };

    expect(claimHistoryListStyles).toEqual(expectedStyles);
  });
});
