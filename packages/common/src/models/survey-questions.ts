// Copyright 2020 Prescryptive Health, Inc.

export type SurveyAnswerType =
  | 'single-select'
  | 'datepicker'
  | 'text'
  | 'multi-select';

export type SurveySelectOptions = Map<string, string>;
