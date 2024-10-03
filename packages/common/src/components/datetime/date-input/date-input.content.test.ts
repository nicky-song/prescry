// Copyright 2020 Prescryptive Health, Inc.

import { IDateInputContent, dateInputContent } from './date-input.content';

describe('dateInputContent', () => {
  it('has expected content', () => {
    const expected: IDateInputContent = {
      yearLabel: 'Year',
      monthLabel: 'Month',
      dayLabel: 'Day',
      monthNames: [
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
      yearErrorMessage: expect.any(Function),
      monthErrorMessage: 'Please specify a valid month.',
      dayErrorMessage: 'Please specify a valid day.',
      dateErrorMessage: 'Please specify a valid date.',
    };

    expect(dateInputContent).toEqual(expected);
  });

  it('has expected year error message', () => {
    expect(dateInputContent.yearErrorMessage()).toEqual(
      'Please specify a valid year.'
    );
    expect(dateInputContent.yearErrorMessage(1900)).toEqual(
      'Please specify a valid year (minimum: 1900).'
    );
  });
});
