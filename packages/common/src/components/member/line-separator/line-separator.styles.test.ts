// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  ILineSeparatorStyles,
  lineSeparatorStyles,
} from './line-separator.styles';

describe('lineSeparatorStyles', () => {
  it('has correct styles', () => {
    const expectedStyles: ILineSeparatorStyles = {
      lineViewStyle: {
        backgroundColor: GrayScaleColor.borderLines,
        height: 1,
      },
      surroundingLineViewStyle: {
        flexGrow: 1,
      },
      linesWithLabelViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      labelTextStyle: {
        ...getFontDimensions(FontSize.small),
        ...getFontFace({ weight: FontWeight.semiBold }),
        color: PrimaryColor.plum,
        marginLeft: Spacing.threeQuarters,
        marginRight: Spacing.threeQuarters,
      },
    };

    expect(lineSeparatorStyles).toEqual(expectedStyles);
  });
});
