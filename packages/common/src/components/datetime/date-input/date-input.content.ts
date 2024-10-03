// Copyright 2020 Prescryptive Health, Inc.

export interface IDateInputContent {
  yearLabel: string;
  monthLabel: string;
  dayLabel: string;
  monthNames: string[];
  yearErrorMessage: (mininmumYear?: number) => string;
  monthErrorMessage: string;
  dayErrorMessage: string;
  dateErrorMessage: string;
}

export const dateInputContent: IDateInputContent = {
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
  yearErrorMessage: (minimumYear?: number) =>
    minimumYear
      ? `Please specify a valid year (minimum: ${minimumYear}).`
      : 'Please specify a valid year.',
  monthErrorMessage: 'Please specify a valid month.',
  dayErrorMessage: 'Please specify a valid day.',
  dateErrorMessage: 'Please specify a valid date.',
};
