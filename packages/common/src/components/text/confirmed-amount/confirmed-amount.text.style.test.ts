// Copyright 2021 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontDimensions, getFontFace } from '../../../theming/fonts';
import {
  confirmedAmountTextStyle,
  IConfirmedAmountTextStyle,
} from './confirmed-amount.text.style';

describe('confirmedAmountTextStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IConfirmedAmountTextStyle = {
      textStyle: {
        color: PrimaryColor.prescryptivePurple,
        ...getFontDimensions(FontSize.large),
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
    };

    expect(confirmedAmountTextStyle).toEqual(expectedStyles);
  });
});
