// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../theming/spacing';
import {
  IInsuranceInformationStyles,
  insuranceInformationStyles,
} from './insusrance-information.style';

describe('insuranceInformationStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IInsuranceInformationStyles = {
      insuranceViewStyle: {
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(insuranceInformationStyles).toEqual(expectedStyles);
  });
});
