// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  IPrescriptionPatientNameStyles,
  styles,
} from './prescription-patient-name.styles';

describe('prescriptionPatientNameStyles', () => {
  it('has expected styles', () => {
    const expectedStyle: IPrescriptionPatientNameStyles = {
      forPatientViewStyle: {
        flexDirection: 'row',
      },
      profileIconStyle: {
        height: 14,
        width: 14,
        marginRight: Spacing.half,
        marginTop: 5,
      },
    };

    expect(styles).toEqual(expectedStyle);
  });
});
