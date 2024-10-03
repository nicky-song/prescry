// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { SurveyItem } from './survey-item';
import { surveyItemStyles } from './survey-item.styles';
import { SurveyTextInput } from '../survey-text-input/survey-text-input';
import { SurveySingleSelect } from '../survey-single-select/survey-single-select';
import { SurveyMultiSelect } from '../survey-multi-select/survey-multi-select';
import { SurveySelectOptions } from '../../../../models/survey-questions';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { SurveyDatePicker } from '../survey-date-picker/survey-date-picker';
import { ITestContainer } from '../../../../testing/test.container';

jest.mock('../../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../survey-single-select/survey-single-select', () => ({
  SurveySingleSelect: () => null,
}));

jest.mock('../survey-text-input/survey-text-input', () => ({
  SurveyTextInput: () => null,
}));
jest.mock('../survey-multi-select/survey-multi-select', () => ({
  SurveyMultiSelect: () => null,
}));

jest.mock('../survey-date-picker/survey-date-picker', () => ({
  SurveyDatePicker: () => null,
}));

const selectOptionsMock: SurveySelectOptions = new Map<string, string>([
  ['opt1', 'option 1'],
  ['opt2', 'option 2'],
  ['opt3', 'option 3'],
]);

const idMock = '0';

describe('SurveyItem', () => {
  it('renders in container with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'red',
    };
    const testRenderer = renderer.create(
      <SurveyItem
        id={'0'}
        type='text'
        question=''
        viewStyle={viewStyle}
        onAnswerChange={jest.fn()}
      />
    );

    const container = testRenderer.root.findByType(View);

    expect(container.props.style).toEqual(viewStyle);
  });

  it('renders question in MarkdownText container with expected properties', () => {
    const question = 'This has some ##markdown##!';
    const testRenderer = renderer.create(
      <SurveyItem
        id={'0'}
        type='text'
        question={question}
        onAnswerChange={jest.fn()}
      />
    );
    const view = testRenderer.root.findByType(View);

    const markdownText = view.props.children[0];

    expect(markdownText.type).toEqual(MarkdownText);
    expect(markdownText.props.textStyle).toEqual(
      surveyItemStyles.questionTextStyle
    );
    expect(markdownText.props.children).toEqual(question);
  });

  it('renders text input with expected properties', () => {
    const placeholder = 'placeholder';
    const answerMock = 'answer';
    const fixedTestIDPart = 'surveyItemId';
    const testRenderer = renderer.create(
      <SurveyItem
        id={'0'}
        type='text'
        question=''
        placeholder={placeholder}
        onAnswerChange={jest.fn()}
        answer={answerMock}
      />
    );
    const view = testRenderer.root.findByType(View);

    const input = view.props.children[2];

    expect(input.type).toEqual(SurveyTextInput);
    expect(input.props.placeholder).toEqual(placeholder);
    expect(input.props.value).toEqual(answerMock);
    expect(input.props.testID).toBe(`${fixedTestIDPart}${idMock}`);
  });

  it('calls onAnswerChange() with expected properties when text input changes', () => {
    const onAnswerChangeMock = jest.fn();
    const id = '1';
    const testRenderer = renderer.create(
      <SurveyItem
        id={id}
        type='text'
        question=''
        onAnswerChange={onAnswerChangeMock}
      />
    );
    const input = testRenderer.root.findByType(SurveyTextInput);

    const onTextChange = input.props.onTextChange;
    const value = 'input value';
    onTextChange(value);

    expect(onAnswerChangeMock).toHaveBeenCalledWith(id, value);
  });

  it('renders single-select with expected properties', () => {
    const placeholder = 'placeholder';
    const answerMock = 'answer';
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='single-select'
        question=''
        selectOptions={selectOptionsMock}
        placeholder={placeholder}
        onAnswerChange={jest.fn()}
        answer={answerMock}
      />
    );
    const fixedTestIDPart = 'surveyItemId';

    const view = testRenderer.root.findByType(View);

    const select = view.props.children[2];

    expect(select.type).toEqual(SurveySingleSelect);
    expect(select.props.placeholder).toEqual(placeholder);
    expect(select.props.options).toEqual(selectOptionsMock);
    expect(select.props.selectedValue).toEqual(answerMock);
    expect(select.props.testID).toBe(`${fixedTestIDPart}${idMock}`);
  });

  it('renders single-select with useCode and expected properties', () => {
    const placeholder = 'placeholder';
    const answerMock = 'answer';
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='single-select'
        question=''
        selectOptions={selectOptionsMock}
        placeholder={placeholder}
        onAnswerChange={jest.fn()}
        answer={answerMock}
        useCode={true}
      />
    );
    const view = testRenderer.root.findByType(View);

    const select = view.props.children[2];

    expect(select.type).toEqual(SurveySingleSelect);
    expect(select.props.placeholder).toEqual(placeholder);
    expect(select.props.options).toEqual(selectOptionsMock);
    expect(select.props.selectedValue).toEqual(answerMock);
    expect(select.props.useCode).toEqual(true);
  });

  it('renders single-select with no children when selectOptions is undefined', () => {
    const placeholder = 'placeholder';
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='single-select'
        question=''
        selectOptions={undefined}
        placeholder={placeholder}
        onAnswerChange={jest.fn()}
      />
    );
    const view = testRenderer.root.findByType(View);
    const select = view.props.children[2];
    expect(select).toBeNull();
  });

  it('calls onAnswerChange() with expected properties when single-select changes', () => {
    const onAnswerChangeMock = jest.fn();
    const id = '1';
    const testRenderer = renderer.create(
      <SurveyItem
        id={id}
        type='single-select'
        question=''
        selectOptions={selectOptionsMock}
        onAnswerChange={onAnswerChangeMock}
      />
    );
    const select = testRenderer.root.findByType(SurveySingleSelect);

    const onSelect = select.props.onSelect;
    const value = 'opt1';
    onSelect(value);

    expect(onAnswerChangeMock).toHaveBeenCalledWith(id, value);
  });

  it('renders multi-select with expected properties', () => {
    const answersMock = ['answer-1', 'answer-2'];
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='multi-select'
        question=''
        selectOptions={selectOptionsMock}
        onAnswerChange={jest.fn()}
        answer={answersMock}
      />
    );
    const fixedTestIDPart = 'surveyItemId';

    const view = testRenderer.root.findByType(View);

    const select = view.props.children[2];

    expect(select.type).toEqual(SurveyMultiSelect);
    expect(select.props.options).toEqual(selectOptionsMock);
    expect(select.props.selectedValues).toEqual(answersMock);
    expect(select.props.testID).toBe(`${fixedTestIDPart}${idMock}`);
  });

  it('renders multi-select with unexpected properties', () => {
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='multi-select'
        question=''
        selectOptions={undefined}
        onAnswerChange={jest.fn()}
      />
    );
    const view = testRenderer.root.findByType(View);

    const select = view.props.children[2];

    expect(select).toBeNull();
  });

  it('calls onAnswerChange() with expected properties when multi-select changes', () => {
    const onAnswerChangeMock = jest.fn();
    const id = '1';
    const testRenderer = renderer.create(
      <SurveyItem
        id={id}
        type='multi-select'
        question=''
        selectOptions={selectOptionsMock}
        onAnswerChange={onAnswerChangeMock}
      />
    );
    const select = testRenderer.root.findByType(SurveyMultiSelect);

    const onSelect = select.props.onSelect;
    const values = ['opt1', 'opt2'];
    onSelect(values);

    expect(onAnswerChangeMock).toHaveBeenCalledWith(id, values);
  });

  it('renders datepicker with expected properties', () => {
    const answerMock = new Date();
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='datepicker'
        question=''
        onAnswerChange={jest.fn()}
        answer={answerMock}
      />
    );
    const fixedTestIDPart = 'surveyItemId';
    const view = testRenderer.root.findByType(View);

    const picker = view.props.children[2];

    expect(picker.type).toEqual(SurveyDatePicker);
    expect(picker.props.date).toEqual(answerMock);
    expect(picker.props.testID).toBe(`${fixedTestIDPart}${idMock}`);
  });

  it('calls onAnswerChange() with expected properties when datepicker changes', () => {
    const onAnswerChangeMock = jest.fn();
    const id = '1';
    const testRenderer = renderer.create(
      <SurveyItem
        id={id}
        type='datepicker'
        question=''
        onAnswerChange={onAnswerChangeMock}
      />
    );
    const picker = testRenderer.root.findByType(SurveyDatePicker);

    const onChange = picker.props.onChange;
    const now = new Date();
    onChange(now);

    expect(onAnswerChangeMock).toHaveBeenCalledWith(id, now);
  });

  it('renders description in MarkdownText container with expected properties', () => {
    const question = 'This has some ##markdown##!';
    const testRenderer = renderer.create(
      <SurveyItem
        id='0'
        type='text'
        question={question}
        onAnswerChange={jest.fn()}
        description='desc'
      />
    );
    const view = testRenderer.root.findByType(View);
    const markdownText = view.props.children[1];
    expect(markdownText.type).toEqual(MarkdownText);
    expect(markdownText.props.textStyle).toEqual(
      surveyItemStyles.descriptionTextStyle
    );
    expect(markdownText.props.children).toEqual('desc');
  });
});
