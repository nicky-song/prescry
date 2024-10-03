// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { SurveyTextInputContent } from './survey-text-input.content';
import { surveyTextInputStyles } from './survey-text-input.styles';

export interface ISurveyTextInputProps {
  placeholder?: string;
  onTextChange: (value: string) => void;
  validation?: string;
  required?: boolean;
  errorMessage?: string;
  value?: string;
  testID?: string;
}

export const SurveyTextInput = (props: ISurveyTextInputProps) => {
  const [minimumCharactersMet, isValidAnswer] = useState(true);
  const [isFocused, setFocus] = useState(false);

  const onFocus = () => {
    setFocus(true);
  };
  const error = (answer: string) => {
    if (isFocused) {
      const answerIsValid = new RegExp(
        props.validation ?? SurveyTextInputContent.defaultValidation
      ).test(answer);
      if (props.required && !answerIsValid) {
        isValidAnswer(false);
        return;
      }
    }
    isValidAnswer(true);
  };
  const onTextChange = (value: string) => {
    props.onTextChange(value);
    error(value);
  };
  const { inputTextStyle, errorTextStyle } = surveyTextInputStyles;
  const { placeholder } = props;

  const errorMessage = !minimumCharactersMet ? (
    <Text style={errorTextStyle}>
      {props.errorMessage ?? SurveyTextInputContent.defaultErrorMessage()}
    </Text>
  ) : undefined;

  return (
    <View>
      <TextInput
        {...(props.testID && { testID: `${props.testID}TextInput` })}
        onChangeText={onTextChange}
        placeholder={placeholder}
        style={inputTextStyle}
        multiline={false}
        onFocus={onFocus}
        value={props.value}
      />
      {errorMessage}
    </View>
  );
};
