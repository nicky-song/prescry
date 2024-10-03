// Copyright 2018 Prescryptive Health, Inc.

import React, { useEffect, useState, FC } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  EndYearForDateOfBirth,
  StartYearForDateOfBirth,
} from '../../../../theming/constants';
import { datePickerStyles } from './date.picker.style';
import { Label } from '../../../text/label/label';
import { View } from 'react-native';
import { BasePicker } from '../base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { datePickerContent } from './date.picker.content';

export interface IDatePickerProps {
  getSelectedDate: (date: string) => void;
  defaultValue?: string;
  startYearForDateOfBirth?: number;
  endYearForDateOfBirth?: number;
  label?: string;
  isRequired?: boolean;
  isSkeleton?: boolean;
  monthList?: string[];
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
}

export interface IDatePickerState {
  days: string;
  months: string;
  years: string;
  selectedDate: string;
}

const padZeroToDate = (date: number) => date.toString().padStart(2, '0');

const createDaysDropDownList = (dayLabel: string) => {
  const days: React.ReactNode[] = [];
  days.push(
    <Picker.Item
      key={datePickerContent.dayKey}
      label={dayLabel}
      value={datePickerContent.dayKey}
    />
  );
  for (let day = 1; day <= 31; day++) {
    days.push(
      <Picker.Item
        key={day}
        label={padZeroToDate(day)}
        value={padZeroToDate(day)}
      />
    );
  }
  return days;
};

const createMonthsDropDownList = (monthLabel: string, monthList: string[]) => {
  const months: React.ReactNode[] = [];
  months.push(
    <Picker.Item
      key={datePickerContent.monthKey}
      label={monthLabel}
      value={datePickerContent.monthKey}
    />
  );
  for (let month = 1; month <= 12; month++) {
    months.push(
      <Picker.Item
        key={month}
        label={monthList[month - 1]}
        value={datePickerContent.monthList[month - 1]}
        testID={`datePickerMonth-${month}`}
      />
    );
  }
  return months;
};

const createYearsDropDownList = (
  startYear: number,
  endYear: number,
  yearLabel: string
) => {
  const years: React.ReactNode[] = [];
  years.push(
    <Picker.Item
      key={datePickerContent.yearKey}
      label={yearLabel}
      value={datePickerContent.yearKey}
    />
  );
  for (let year = startYear; year >= endYear; year--) {
    years.push(
      <Picker.Item key={year} label={year.toString()} value={year.toString()} />
    );
  }

  return years;
};

const defaultDatePicker: IDatePickerState = {
  days: datePickerContent.dayKey,
  months: datePickerContent.monthKey,
  selectedDate: '',
  years: datePickerContent.yearKey,
};

export const DatePicker: FC<IDatePickerProps> = (props: IDatePickerProps) => {
  const {
    isRequired,
    label,
    startYearForDateOfBirth = StartYearForDateOfBirth,
    endYearForDateOfBirth = EndYearForDateOfBirth,
    isSkeleton = false,
    dayLabel = datePickerContent.dayLabel,
    monthLabel = datePickerContent.monthLabel,
    monthList = datePickerContent.monthList,
    yearLabel = datePickerContent.yearLabel,
  } = props;

  const [datePicker, setDatePicker] =
    useState<IDatePickerState>(defaultDatePicker);

  useEffect(() => {
    processDateOfBirthIntoState();
  }, []);

  useEffect(() => {
    if (datePicker.selectedDate !== '') {
      props.getSelectedDate(datePicker.selectedDate);
    }
  }, [datePicker]);

  const dateFormat = (month: string, day: string, year: string) => {
    return `${month}-${day}-${year}`;
  };

  const processDateOfBirthIntoState = () => {
    if (props.defaultValue) {
      const convertedDate = new Date(props.defaultValue);
      const day = padZeroToDate(convertedDate.getUTCDate());
      const month = datePickerContent.monthList[convertedDate.getUTCMonth()];
      const year = convertedDate.getUTCFullYear().toString();
      setDatePicker({
        days: day,
        months: month,
        selectedDate: dateFormat(month, day, year),
        years: year,
      });
    }
  };

  const onDayChangeHandler = (days: ItemValue, _daysIndex: number) => {
    const selectedDays = days as string;
    const { months, years } = datePicker;
    const selectedDate = dateFormat(months, selectedDays, years);
    setDatePicker({ ...datePicker, days: selectedDays, selectedDate });
  };
  const onMonthChangeHandler = (months: ItemValue, _monthsIndex: number) => {
    const selectedMonths = months as string;
    const { days, years } = datePicker;
    const selectedDate = dateFormat(selectedMonths, days, years);
    setDatePicker({ ...datePicker, months: selectedMonths, selectedDate });
  };
  const onYearChangeHandler = (years: ItemValue, _yearsIndex: number) => {
    const selectedYears = years as string;
    const { days, months } = datePicker;
    const selectedDate = dateFormat(months, days, selectedYears);
    setDatePicker({ ...datePicker, years: selectedYears, selectedDate });
  };

  return (
    <PickerWrapper
      isRequired={isRequired}
      label={label}
      isSkeleton={isSkeleton}
    >
      <View style={datePickerStyles.containerViewStyle}>
        <BasePicker
          selectedValue={datePicker.months}
          style={datePickerStyles.monthPickerTextStyle}
          onValueChange={onMonthChangeHandler}
          testID='months'
        >
          {createMonthsDropDownList(monthLabel, monthList)}
        </BasePicker>
        <BasePicker
          selectedValue={datePicker.days}
          style={datePickerStyles.dayPickerTextStyle}
          onValueChange={onDayChangeHandler}
          testID='days'
        >
          {createDaysDropDownList(dayLabel)}
        </BasePicker>
        <BasePicker
          selectedValue={datePicker.years}
          style={datePickerStyles.yearPickerTextStyle}
          onValueChange={onYearChangeHandler}
          testID='years'
        >
          {createYearsDropDownList(
            startYearForDateOfBirth,
            endYearForDateOfBirth,
            yearLabel
          )}
        </BasePicker>
      </View>
    </PickerWrapper>
  );
};

// exported for testing only
export const PickerWrapper: React.FunctionComponent<
  Pick<IDatePickerProps, 'isRequired' | 'label' | 'isSkeleton'>
> = ({ children, label, isRequired, isSkeleton }) => {
  return label ? (
    // TODO: This isn't strictly legitmate but it will do for the time-being. A label
    // is intended to apply to only one input element. The *correct* way to do is to create
    // (or emulate with aria-describedby -- see http://last-child.com/aria-describedby-fieldset)
    // a fieldset with a legend.
    <Label isRequired={isRequired} label={label} isSkeleton={isSkeleton}>
      {children}
    </Label>
  ) : (
    <>{children}</>
  );
};
