// Copyright 2023 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  IPharmaciesSectionStyles,
  pharmaciesSectionStyles,
} from './pharmacies.section.styles';

describe('pharmaciesSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPharmaciesSectionStyles = {
      sectionViewStyle: { marginTop: Spacing.base, flexDirection: 'row' },
      iconViewStyle: { marginRight: Spacing.base, paddingTop: Spacing.quarter },
      labelTextStyle: { ...getFontFace({ weight: FontWeight.semiBold }) },
      bodyTextStyle: { marginTop: Spacing.half },
      textViewStyle: { flex: 1 },
    };

    expect(pharmaciesSectionStyles).toEqual(expectedStyles);
  });
});
