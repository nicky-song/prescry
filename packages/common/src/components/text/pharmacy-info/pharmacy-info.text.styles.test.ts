// Copyright 2023 Prescryptive Health, Inc.

import { getFontDimensions, FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IPharmacyInfoTextStyles,
  pharmacyInfoTextStyles,
} from './pharmacy-info.text.styles';

describe('pharmacyInfoTextStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPharmacyInfoTextStyles = {
      pharmacyNameViewStyle: {
        marginBottom: Spacing.quarter,
        ...getFontDimensions(FontSize.body),
      },
      pharmacyAddressTextStyle: {
        ...getFontDimensions(FontSize.small),
      },
    };

    expect(pharmacyInfoTextStyles).toEqual(expectedStyles);
  });
});
