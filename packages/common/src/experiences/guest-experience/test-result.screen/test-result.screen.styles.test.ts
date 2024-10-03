// Copyright 2020 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  ITestResultScreenStyles,
  testResultScreenStyles,
} from './test-result.screen.styles';

describe('testResultScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ITestResultScreenStyles = {
      bodyViewStyle: {
        marginTop: Spacing.base,
      },
      expanderViewStyle: {
        marginLeft: -Spacing.times1pt5,
        marginRight: -Spacing.times1pt5,
      },
    };

    expect(testResultScreenStyles).toEqual(expectedStyles);
  });
});
