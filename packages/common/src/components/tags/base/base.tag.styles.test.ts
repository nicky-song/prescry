// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import {
  getFontDimensions,
  FontSize,
  getFontFace,
  FontWeight,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import { IBaseTagStyles, baseTagStyles } from './base.tag.styles';

describe('baseTagStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IBaseTagStyles = {
      labelTextStyle: {
        ...getFontDimensions(FontSize.xSmall),
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      iconTextStyle: {
        marginRight: Spacing.half,
      },
      viewStyle: {
        paddingTop: Spacing.half,
        paddingBottom: Spacing.half,
        paddingLeft: Spacing.half,
        paddingRight: Spacing.half,
        borderRadius: BorderRadius.half,
        backgroundColor: GrayScaleColor.lightGray,
        width: 'fit-content',
        flexDirection: 'row',
        alignItems: 'center',
      },
    };

    expect(baseTagStyles).toEqual(expectedStyles);
  });
});
