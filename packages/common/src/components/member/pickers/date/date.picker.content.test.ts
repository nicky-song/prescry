// Copyright 2022 Prescryptive Health, Inc.

import { datePickerContent, IDatePickerContent } from './date.picker.content';

describe('datePickerContent', () => {
  it('has expected content', () => {
    const expectedContent: IDatePickerContent = {
      dayKey: 'dd',
      dayLabel: 'Day',
      monthKey: 'mm',
      monthLabel: 'Month',
      yearKey: 'yyyy',
      yearLabel: 'Year',
      monthList: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    };

    expect(datePickerContent).toEqual(expectedContent);
  });
});
