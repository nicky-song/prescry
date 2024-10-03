// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPrescriptionListStyles,
  prescriptionListStyles,
} from './prescription.list.styles';

describe('prescriptionListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrescriptionListStyles = {
      titleTextStyle: {
        marginBottom: Spacing.times2,
      },
      prescriptionCardViewStyle: {
        marginTop: Spacing.times1pt25,
      },
      prescriptionCardFirstViewStyle: {},
    };

    expect(prescriptionListStyles).toEqual(expectedStyles);
  });
});
