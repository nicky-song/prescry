// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { serviceSelectionScreenStyles } from './service-selection-screen.styles';

describe('serviceSelectionScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles = {
      titleTextStyle: {
        marginBottom: Spacing.base,
      },
      moreInfoVaccineLinkTextStyle: {
        marginTop: Spacing.base,
        flexGrow: 0,
      },
    };
    expect(serviceSelectionScreenStyles).toEqual(expectedStyles);
  });
});
