// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { TextInput } from 'react-native';
import renderer from 'react-test-renderer';
import { SurveyTextInput } from './survey-text-input';
import { surveyTextInputStyles } from './survey-text-input.styles';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('SurveyTextInput', () => {
  it('renders as TextInput with expected properties', () => {
    const isValidAnswerMock = jest.fn();
    const setFocusMock = jest.fn();
    const useStateMock = useState as jest.Mock;
    useStateMock
      .mockReturnValueOnce([true, isValidAnswerMock])
      .mockReturnValueOnce([false, setFocusMock]);
    const placeholder = 'placeholder';
    const onTextChange = jest.fn();
    const valueMock = 'value';
    const mockedTestID = 'mockTestID';

    const testRenderer = renderer.create(
      <SurveyTextInput
        placeholder={placeholder}
        onTextChange={onTextChange}
        value={valueMock}
        testID={mockedTestID}
      />
    );

    const input = testRenderer.root.findByType(TextInput);
    expect(input.props.placeholder).toEqual(placeholder);
    expect(input.props.value).toEqual(valueMock);

    const onChangeText = input.props.onChangeText;
    onChangeText('test');

    expect(isValidAnswerMock).toHaveBeenNthCalledWith(1, true);
    expect(onTextChange).toHaveBeenCalledTimes(1);
    expect(input.props.multiline).toEqual(false);
    expect(input.props.style).toEqual(surveyTextInputStyles.inputTextStyle);
    expect(input.props.testID).toBe(`${mockedTestID}TextInput`);
  });
  it('sets focus correctly', () => {
    const isValidAnswerMock = jest.fn();
    const setFocusMock = jest.fn();
    const useStateMock = useState as jest.Mock;
    useStateMock
      .mockReturnValueOnce([true, isValidAnswerMock])
      .mockReturnValueOnce([false, setFocusMock]);
    const placeholder = 'placeholder';
    const onTextChange = jest.fn();
    const testRenderer = renderer.create(
      <SurveyTextInput placeholder={placeholder} onTextChange={onTextChange} />
    );
    const input = testRenderer.root.findByType(TextInput);
    const onFocus = input.props.onFocus;
    onFocus(true);
    expect(setFocusMock).toHaveBeenNthCalledWith(1, true);
  });

  it('correctly identifies input with less than minimum characters', () => {
    const isValidAnswerMock = jest.fn();
    const setFocusMock = jest.fn();
    const useStateMock = useState as jest.Mock;
    useStateMock
      .mockReturnValueOnce([false, isValidAnswerMock])
      .mockReturnValueOnce([true, setFocusMock]);
    const placeholder = 'placeholder';
    const onTextChange = jest.fn();
    const testRenderer = renderer.create(
      <SurveyTextInput
        placeholder={placeholder}
        onTextChange={onTextChange}
        required={true}
      />
    );
    const input = testRenderer.root.findByType(TextInput);
    const onChangeText = input.props.onChangeText;
    onChangeText('a');
    expect(isValidAnswerMock).toHaveBeenNthCalledWith(1, false);
  });

  it('correctly identifies inputs compared to custom regex', () => {
    const isValidAnswerMock = jest.fn();
    const setFocusMock = jest.fn();
    const useStateMock = useState as jest.Mock;
    useStateMock
      .mockReturnValueOnce([false, isValidAnswerMock])
      .mockReturnValueOnce([true, setFocusMock]);
    const placeholder = 'placeholder';
    const onTextChange = jest.fn();
    const validationRegex = '^[a-zA-Z0-9_-]{8,}$';
    const testRenderer = renderer.create(
      <SurveyTextInput
        placeholder={placeholder}
        onTextChange={onTextChange}
        required={true}
        validation={validationRegex}
      />
    );
    const input = testRenderer.root.findByType(TextInput);
    const onChangeText = input.props.onChangeText;
    onChangeText('aBcD');
    onChangeText('A1B2C3D4');
    onChangeText('!nval!d!NPUT');
    expect(isValidAnswerMock).toHaveBeenNthCalledWith(1, false);
    expect(isValidAnswerMock).toHaveBeenNthCalledWith(2, true);
    expect(isValidAnswerMock).toHaveBeenNthCalledWith(3, false);
  });
});
