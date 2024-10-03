// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../../../theming/spacing';
import {
  ISmartPriceSectionStyles,
  smartPriceSectionStyles,
} from './smart-price.section.styles';

describe('smartPriceSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ISmartPriceSectionStyles = {
      containerTextStyle: { marginTop: Spacing.base },
    };

    expect(smartPriceSectionStyles).toEqual(expectedStyles);
  });
});
