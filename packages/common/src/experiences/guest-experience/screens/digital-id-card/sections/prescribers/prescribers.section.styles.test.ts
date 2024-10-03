// Copyright 2023 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import {
  IPrescribersSectionStyles,
  prescribersSectionStyles,
} from './prescribers.section.styles';

describe('prescribersSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrescribersSectionStyles = {
      sectionViewStyle: { marginTop: Spacing.base, flexDirection: 'row' },
      iconViewStyle: { marginRight: Spacing.base, paddingTop: Spacing.quarter },
      labelTextStyle: { ...getFontFace({ weight: FontWeight.semiBold }) },
      bodyTextStyle: { marginTop: Spacing.half },
      textViewStyle: { flex: 1 },
    };

    expect(prescribersSectionStyles).toEqual(expectedStyles);
  });
});
