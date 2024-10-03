// Copyright 2022 Prescryptive Health, Inc.

import {
  getFontFace,
  FontWeight,
  getFontDimensions,
  FontSize,
} from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IAccumulatorProgressBarStyles,
  accumulatorProgressBarStyles,
} from './accumulator.progress-bar.styles';

describe('accumulatorProgressBarStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAccumulatorProgressBarStyles = {
      titleContainerViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.quarter,
      },
      maxValueContainerViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.half,
      },
      maxLabelTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      maxValueTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        ...getFontDimensions(FontSize.large),
      },
      maxProgressLabelViewStyle: {
        alignItems: 'flex-end',
      },
    };

    expect(accumulatorProgressBarStyles).toEqual(expectedStyles);
  });
});
