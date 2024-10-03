// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../theming/spacing';
import { IInsuranceStyles, insuranceStyles } from './insusrance.style';

describe('insuranceStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IInsuranceStyles = {
      insuranceViewStyle: {
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(insuranceStyles).toEqual(expectedStyles);
  });
});
