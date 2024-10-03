// Copyright 2020 Prescryptive Health, Inc.

import React, { useState, ReactNode, useEffect } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { dateInputStyles } from './date-input.styles';
import DateValidator from '../../../utils/validators/date.validator';
import { LabelText } from '../../primitives/label-text';
import { dateInputContent } from './date-input.content';
import { BasePicker } from '../../member/pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { BaseText } from '../../text/base-text/base-text';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';

export interface IDateInputProps {
  onChange: (date?: Date) => void;
  defaultDay?: number;
  defaultMonth?: number; // range: 1-12!
  defaultYear?: number;
  minimumYear?: number;
  disabled?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const DateInput = (props: IDateInputProps) => {
  const styles = dateInputStyles;
  const content = dateInputContent;

  const [hasDayError, setHasDayError] = useState<boolean>();
  const [hasMonthError, setHasMonthError] = useState<boolean>();
  const [hasYearError, setHasYearError] = useState<boolean>();
  const [hasDateError, setHasDateError] = useState<boolean>();

  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const {
    disabled,
    onChange,
    viewStyle,
    defaultYear,
    defaultDay,
    defaultMonth,
    textStyle,
    minimumYear = 1900,
  } = props;

  useEffect(() => {
    if (defaultYear) {
      onYearChange(defaultYear.toString());
    }

    if (defaultMonth) {
      onMonthChange(defaultMonth.toString(), 0);
    }

    if (defaultDay) {
      onDayChange(defaultDay.toString());
    }
  }, [defaultYear, defaultMonth, defaultDay]);

  useEffect(() => {
    const isDateValid = DateValidator.isDateValid(year, month, day);
    const allEmpty = areAllInputsEmpty(year, month, day);

    setHasDateError(!allEmpty && !isDateValid && haveAllInputsBeenValidated());

    onChange(isDateValid ? buildDate(year, month, day) : undefined);
  }, [year, month, day]);

  const onDayChange = (value: string) => {
    setDay(value);
    setHasDayError(!isEmpty(value) && !DateValidator.isDayValid(value));
  };

  const onMonthChange = (value: ItemValue, _valueIndex: number) => {
    const selectedValue = value as string;
    setMonth(selectedValue);
    setHasMonthError(
      !isEmpty(selectedValue) && !DateValidator.isMonthValid(selectedValue)
    );
  };

  const onYearChange = (value: string) => {
    setYear(value);
    setHasYearError(
      !isEmpty(value) && !DateValidator.isYearValid(value, minimumYear)
    );
  };

  return (
    <View style={[styles.containerViewStyle, viewStyle]}>
      <View style={styles.fieldViewStyle}>
        <LabelText
          style={[styles.fieldTextStyle, textStyle, { marginLeft: 0 }]}
        >
          <BaseText style={styles.labelTextStyle}>
            {content.monthLabel}
          </BaseText>
          {renderMonthPicker()}
        </LabelText>

        <LabelText style={[styles.fieldTextStyle, textStyle]}>
          <BaseText style={styles.labelTextStyle}>{content.dayLabel}</BaseText>
          <PrimaryTextInput
            defaultValue={defaultDay?.toString()}
            onChangeText={onDayChange}
            editable={!disabled}
            keyboardType='numeric'
            selectTextOnFocus={true}
            viewStyle={[styles.dayInputViewStyle, viewStyle]}
            {...(props.testID && { testID: `${props.testID}DayInput` })}
          />
        </LabelText>

        <LabelText
          style={[styles.fieldTextStyle, textStyle, { marginRight: 0 }]}
        >
          <BaseText style={styles.labelTextStyle}>{content.yearLabel}</BaseText>
          <PrimaryTextInput
            defaultValue={defaultYear?.toString()}
            onChangeText={onYearChange}
            editable={!disabled}
            keyboardType='numeric'
            selectTextOnFocus={true}
            viewStyle={[styles.yearInputViewStyle, viewStyle]}
            {...(props.testID && { testID: `${props.testID}YearInput` })}
          />
        </LabelText>
      </View>
      {renderFieldError()}
    </View>
  );

  function renderMonthPicker() {
    const monthLabels = ['', ...content.monthNames];

    return (
      <BasePicker
        style={styles.monthInputTextStyle}
        onValueChange={onMonthChange}
        selectedValue={month}
        {...(props.testID && { testID: `${props.testID}MonthPicker` })}
      >
        {monthLabels.map(monthToPickerItem)}
      </BasePicker>
    );
  }

  function monthToPickerItem(monthLabel: string, index: number): ReactNode {
    return (
      <Picker.Item
        key={index}
        value={index ? index.toString() : ''}
        label={monthLabel}
      />
    );
  }

  function renderFieldError(): ReactNode {
    const errorMessage = getErrorMessage();
    if (!errorMessage) {
      return null;
    }

    return (
      <BaseText style={styles.fieldErrorTextStyle}>{errorMessage}</BaseText>
    );
  }

  function haveAllInputsBeenValidated(): boolean {
    return (
      hasDayError !== undefined &&
      hasMonthError !== undefined &&
      hasYearError !== undefined
    );
  }

  function getErrorMessage(): string {
    if (hasMonthError) {
      return content.monthErrorMessage;
    }

    if (hasYearError) {
      return content.yearErrorMessage(minimumYear);
    }

    if (hasDayError) {
      return content.dayErrorMessage;
    }

    if (hasDateError) {
      return content.dateErrorMessage;
    }

    return '';
  }
};

function areAllInputsEmpty(year: string, month: string, day: string): boolean {
  return isEmpty(year) && isEmpty(month) && isEmpty(day);
}

function isEmpty(value: string): boolean {
  return !value.trim();
}

function buildDate(year: string, month: string, day: string): Date {
  return new Date(Number(year), Number(month) - 1, Number(day));
}
