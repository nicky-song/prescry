// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IBenefitsListStyles,
  benefitsListStyles,
} from './benefits.list.styles';

describe('benefitsListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IBenefitsListStyles = {
      itemImageStyle: {
        height: 40,
        width: 40,
        maxWidth: 40,
      },
      middleItemViewStyle: {
        marginTop: Spacing.times2,
        marginBottom: Spacing.times2,
      },
    };

    expect(benefitsListStyles).toEqual(expectedStyles);
  });
});
