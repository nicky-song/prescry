// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IClaimHistoryScreenStyles,
  claimHistoryScreenStyles,
} from './claim-history.screen.styles';

describe('claimHistoryScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IClaimHistoryScreenStyles = {
      noClaimsTextViewStyle: {
        marginBottom: Spacing.times2,
      },
      downloadButtonViewStyle: {
        width: 'fit-content',
        marginLeft: -Spacing.base,
        marginTop: -Spacing.base,
        marginBottom: Spacing.base,
      },
    };

    expect(claimHistoryScreenStyles).toEqual(expectedStyles);
  });
});
