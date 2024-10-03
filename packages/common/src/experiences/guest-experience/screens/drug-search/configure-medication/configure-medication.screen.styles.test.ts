// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../../theming/spacing';
import {
  configureMedicationScreenStyles,
  IConfigureMedicationScreenStyles,
} from './configure-medication.screen.styles';

describe('configureMedicationScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IConfigureMedicationScreenStyles = {
      quantityViewStyle: {
        width: '25%',
      },
      buttonViewStyle: { marginTop: Spacing.times2 },
      toggleGroupViewStyle: {
        marginBottom: Spacing.base,
      },
      topToggleButtonViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
    };

    expect(configureMedicationScreenStyles).toEqual(expectedStyles);
  });
});
