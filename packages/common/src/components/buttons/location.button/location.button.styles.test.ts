// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  ILocationButtonStyles,
  locationButtonStyles,
} from './location.button.styles';

describe('locationButtonStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: ILocationButtonStyles = {
      locationButtonTextStyle: {
        marginRight: Spacing.half,
      },
    };

    expect(locationButtonStyles).toEqual(expectedStyles);
  });
});
