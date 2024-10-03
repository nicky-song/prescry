// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IAccumulatorListStyles,
  accumulatorListStyles,
} from './accumulator.list.styles';

describe('accumulatorListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAccumulatorListStyles = {
      accumulatorCardViewStyle: {
        marginTop: Spacing.base,
      },
    };

    expect(accumulatorListStyles).toEqual(expectedStyles);
  });
});
