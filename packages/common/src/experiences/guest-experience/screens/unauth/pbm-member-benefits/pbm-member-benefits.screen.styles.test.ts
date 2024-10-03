// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  IPbmMemberBenefitsScreenStyles,
  pbmMemberBenefitsScreenStyles,
} from './pbm-member-benefits.screen.styles';

describe('pbmMemberBenefitsScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPbmMemberBenefitsScreenStyles = {
      titleTextStyle: {
        marginBottom: Spacing.base,
      },
      instructionsTextStyle: {
        flexGrow: 0,
      },
      separatorViewStyle: {
        marginTop: Spacing.times1pt5,
        marginBottom: Spacing.times1pt5,
      },
      bottomContentViewStyle: {
        marginTop: Spacing.times1pt5,
        flexGrow: 0,
      },
      bodyContainerViewStyle: {},
    };

    expect(pbmMemberBenefitsScreenStyles).toEqual(expectedStyles);
  });
});
