// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IVaccinationRecordScreenStyles,
  vaccinationRecordScreenStyles,
} from './vaccination-record-screen.styles';

describe('vaccinationRecordScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IVaccinationRecordScreenStyles = {
      expanderViewStyle: {
        marginLeft: -Spacing.times1pt5,
        marginRight: -Spacing.times1pt5,
      },
      moreInfoTextStyle: {
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(vaccinationRecordScreenStyles).toEqual(expectedStyles);
  });
});
