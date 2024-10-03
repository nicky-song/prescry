// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { getNewDate } from '../../../../utils/date-time/get-new-date';
import { DateInput } from '../../../datetime/date-input/date-input';
import { surveyDatePickerStyles } from './survey-date-picker.styles';

export interface ISurveyDatePickerProps {
  onChange: (date?: Date) => void;
  minimumYear?: number;
  date?: Date;
  testID?: string;
}

export const SurveyDatePicker = ({
  onChange,
  minimumYear = 1900,
  date,
  testID,
}: ISurveyDatePickerProps) => {
  const styles = surveyDatePickerStyles;

  const [lastValidDate, setLastValidDate] = useState(getNewDate());

  useEffect(() => {
    if (date) {
      setLastValidDate(date);
    }
  }, [date]);

  const defaultYear = date ? date.getFullYear() : lastValidDate.getFullYear();
  const defaultMonth = date ? date.getMonth() + 1 : undefined;
  const defaultDay = date ? date.getDate() : undefined;

  return (
    <DateInput
      {...(testID && { testID: `${testID}Input` })}
      onChange={onChange}
      defaultYear={defaultYear}
      defaultMonth={defaultMonth}
      defaultDay={defaultDay}
      textStyle={styles.inputTextStyle}
      minimumYear={minimumYear}
    />
  );
};
