// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  IPlanMemberSupportSectionStyles,
  planMemberSupportSectionStyles,
} from './plan-member-support.section.styles';

describe('planMemberSupportSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPlanMemberSupportSectionStyles = {
      panelViewStyle: {
        marginTop: Spacing.times2,
      },
    };

    expect(planMemberSupportSectionStyles).toEqual(expectedStyles);
  });
});
