// Copyright 2021 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';
import {
  IPinFeatureWelcomeScreenStyles,
  pinFeatureWelcomeScreenStyles,
} from './pin-feature-welcome.screen.styles';

describe('pinFeatureWelcomeScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPinFeatureWelcomeScreenStyles = {
      titleTextStyle: {
        marginBottom: Spacing.times1pt5,
        marginTop: Spacing.times1pt5,
        textAlign: 'center',
        color: PrimaryColor.prescryptivePurple,
      },
      headerViewStyle: {
        flexGrow: 0,
      },
      linksViewStyle: {
        marginBottom: Spacing.times2,
      },
    };

    expect(pinFeatureWelcomeScreenStyles).toEqual(expectedStyles);
  });
});
