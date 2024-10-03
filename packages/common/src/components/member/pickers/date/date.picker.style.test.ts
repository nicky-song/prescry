// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import { datePickerStyles, IDatePickerStyle } from './date.picker.style';

describe('datePickerStyles', () => {
  it('should display correct styles', () => {
    const expectedStyles: IDatePickerStyle = {
      containerViewStyle: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
      },
      monthPickerTextStyle: {
        flex: 4,
      },
      dayPickerTextStyle: {
        flex: 1,
        marginHorizontal: Spacing.half,
      },
      yearPickerTextStyle: {
        flex: 2,
      },
    };

    expect(datePickerStyles).toEqual(expectedStyles);
  });
});
