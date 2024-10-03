// Copyright 2022 Prescryptive Health, Inc.

import { FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IFilterButtonStyles,
  filterButtonStyles,
} from './filter.button.styles';

describe('sortOnButtonStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IFilterButtonStyles = {
      iconTextStyle: {
        fontSize: FontSize.body,
        marginRight: Spacing.half,
      },
      toolButtonViewStyle: {
        padding: 0,
        width: 74,
      },
    };

    expect(filterButtonStyles).toEqual(expectedStyles);
  });
});
