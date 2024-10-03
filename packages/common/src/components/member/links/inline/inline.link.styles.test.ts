// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { IInlineLinkStyles, inlineLinkStyles } from './inline.link.styles';

describe('inlineLinkStyles', () => {
  it('has expected styles', () => {
    const commonTextStyle: TextStyle = {
      ...getFontFace({ weight: FontWeight.semiBold }),
      textDecorationLine: 'none',
      borderBottomWidth: 1,
    };

    const expectedStyles: IInlineLinkStyles = {
      disabledTextStyle: {
        ...commonTextStyle,
        color: GrayScaleColor.disabledGray,
        borderBottomColor: GrayScaleColor.disabledGray,
      },
      enabledTextStyle: {
        ...commonTextStyle,
        color: PrimaryColor.prescryptivePurple,
        borderBottomColor: PrimaryColor.prescryptivePurple,
      },
      pressTextStyle: {
        opacity: 0.5,
      },
    };

    expect(inlineLinkStyles).toEqual(expectedStyles);
  });
});
