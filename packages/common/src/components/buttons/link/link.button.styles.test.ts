// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { ILinkButtonStyles, linkButtonStyles } from './link.button.styles';

describe('linkButtonStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILinkButtonStyles = {
      baseTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        borderBottomWidth: 2,
      },
      enabledTextStyle: {
        color: PrimaryColor.prescryptivePurple,
        borderBottomColor: PrimaryColor.prescryptivePurple,
      },
      disabledTextStyle: {
        color: GrayScaleColor.disabledGray,
        borderBottomColor: GrayScaleColor.disabledGray,
      },
      baseViewStyle: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
      },
    };

    expect(linkButtonStyles).toEqual(expectedStyles);
  });
});
