// Copyright 2022 Prescryptive Health, Inc.

export interface IDatePickerContent {
  dayKey: string;
  dayLabel: string;
  monthKey: string;
  monthLabel: string;
  yearKey: string;
  yearLabel: string;
  monthList: string[];
}

// TODO: Remove when app is localized and refer to strapi for not "key" values
export const datePickerContent: IDatePickerContent = {
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
