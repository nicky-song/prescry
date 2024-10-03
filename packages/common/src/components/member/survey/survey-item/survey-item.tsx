// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { surveyItemStyles } from './survey-item.styles';
import { SurveyTextInput } from '../survey-text-input/survey-text-input';
import { SurveySingleSelect } from '../survey-single-select/survey-single-select';
import { SurveyMultiSelect } from '../survey-multi-select/survey-multi-select';
import {
  SurveyAnswerType,
  SurveySelectOptions,
} from '../../../../models/survey-questions';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { SurveyDatePicker } from '../survey-date-picker/survey-date-picker';
import { mandatoryIconUsingStrikeThroughStyle } from '../../../../theming/constants';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

export interface ISurveyItemProps {
  id: string;
  question: string;
  placeholder?: string;
  type: SurveyAnswerType;
  selectOptions?: SurveySelectOptions;
  viewStyle?: StyleProp<ViewStyle>;
  isRequired?: boolean;
  description?: string;
  validation?: string;
  errorMessage?: string;
  onAnswerChange: (id: string, value?: string | string[] | Date) => void;
  answer?: string | string[] | Date;
  useCode?: boolean;
}

export function SurveyItem(props: ISurveyItemProps) {
  const { question, viewStyle, id } = props;
  const { questionTextStyle, mandatoryIconTextStyle } = surveyItemStyles;

  function renderInputComponent(): ReactNode {
    const {
      type,
      placeholder,
      onAnswerChange,
      selectOptions,
      isRequired,
      validation,
      errorMessage,
      answer,
      useCode,
    } = props;

    if (type === 'text') {
      const onTextChange = (newTextValue: string) => {
        onAnswerChange(id, newTextValue);
      };
      return (
        <SurveyTextInput
          testID={`surveyItemId${id}`}
          placeholder={placeholder}
          onTextChange={onTextChange}
          validation={validation}
          errorMessage={errorMessage}
          required={isRequired}
          value={answer as string}
        />
      );
    }

    if (type === 'single-select') {
      if (!selectOptions) {
        return null;
      }

      const onSelect = (
        selectedValue: ItemValue,
        _selectedValueIndex: number
      ) => {
        onAnswerChange(id, selectedValue as string);
      };
      return (
        <SurveySingleSelect
          testID={`surveyItemId${id}`}
          placeholder={placeholder}
          onSelect={onSelect}
          options={selectOptions}
          selectedValue={answer as string}
          useCode={useCode}
        />
      );
    }

    if (type === 'multi-select') {
      if (!selectOptions) {
        return null;
      }

      const onSelect = (selectedValues: string[]) => {
        onAnswerChange(id, selectedValues);
      };
      return (
        <SurveyMultiSelect
          testID={`surveyItemId${id}`}
          onSelect={onSelect}
          options={selectOptions}
          selectedValues={answer as string[]}
        />
      );
    }

    if (type === 'datepicker') {
      const onChange = (date?: Date) => {
        onAnswerChange(id, date);
      };
      return (
        <SurveyDatePicker
          testID={`surveyItemId${id}`}
          onChange={onChange}
          date={answer as Date}
        />
      );
    }

    return null;
  }

  function renderDescription(): ReactNode {
    const { description } = props;
    const { descriptionTextStyle } = surveyItemStyles;

    if (!description) {
      return null;
    }
    return (
      <MarkdownText textStyle={descriptionTextStyle}>
        {description}
      </MarkdownText>
    );
  }

  function renderMarkdownCaption(): ReactNode {
    return props.isRequired ? (
      <MarkdownText
        textStyle={questionTextStyle}
        markdownTextStyle={mandatoryIconTextStyle}
      >
        {`${question} ${mandatoryIconUsingStrikeThroughStyle}`}
      </MarkdownText>
    ) : (
      <MarkdownText
        textStyle={questionTextStyle}
        markdownTextStyle={mandatoryIconTextStyle}
      >
        {question}
      </MarkdownText>
    );
  }

  return (
    <View style={viewStyle} testID={`question-${id}`}>
      {renderMarkdownCaption()}
      {renderDescription()}
      {renderInputComponent()}
    </View>
  );
}
