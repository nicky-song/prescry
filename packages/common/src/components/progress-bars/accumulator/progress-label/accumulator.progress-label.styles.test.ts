// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IAccumulatorProgressLabelStyles,
  accumulatorProgressLabelStyles,
} from './accumulator.progress-label.styles';

describe('accumulatorProgressLabelStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAccumulatorProgressLabelStyles = {
      labelTextStyle: {
        marginBottom: Spacing.quarter,
      },
    };

    expect(accumulatorProgressLabelStyles).toEqual(expectedStyles);
  });
});
