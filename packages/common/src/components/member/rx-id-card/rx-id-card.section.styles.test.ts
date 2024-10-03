// Copyright 2023 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IRxIdCardSectionStyles,
  rxIdCardSectionStyles,
} from './rx-id-card.section.styles';

describe('rxIdCardSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IRxIdCardSectionStyles = {
      cardSectionViewStyle: {
        backgroundColor: GrayScaleColor.lightGray,
        paddingBottom: Spacing.times1pt5,
        paddingLeft: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
        paddingTop: Spacing.times1pt5,
      },
      titleTextStyle: { marginBottom: Spacing.base },
      descriptionViewStyle: { marginBottom: Spacing.times1pt5 },
    };

    expect(rxIdCardSectionStyles).toEqual(expectedStyles);
  });
});
