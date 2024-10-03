// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { SurveySingleSelect } from './survey-single-select';
import { surveySingleSelectStyles } from './survey-single-select.styles';
import { SurveySelectOptions } from '../../../../models/survey-questions';
import { BasePicker } from '../../pickers/base/base.picker';

jest.mock('../../pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

describe('SurveySingleSelect', () => {
  it('renders in Text container with expected properties', () => {
    const testRenderer = renderer.create(
      <SurveySingleSelect onSelect={jest.fn()} options={new Map()} />
    );

    const container = testRenderer.root.findByType(View);

    expect(container.props.style).toEqual(
      surveySingleSelectStyles.pickerContainerTextStyle
    );
  });

  it('renders Picker with expected properties', () => {
    const onSelectMock = jest.fn();
    const selectedValueMock = 'selected-value';
    const mockedTestID = 'mockTestID';

    const testRenderer = renderer.create(
      <SurveySingleSelect
        onSelect={onSelectMock}
        options={new Map()}
        selectedValue={selectedValueMock}
        testID={mockedTestID}
      />
    );

    const text = testRenderer.root.findByType(View);
    const picker = text.props.children;

    expect(picker.type).toEqual(BasePicker);

    expect(picker.props.onValueChange).toEqual(onSelectMock);
    expect(picker.props.enabled).toEqual(true);
    expect(picker.props.selectedValue).toEqual(selectedValueMock);
    expect(picker.props.testID).toBe(`${mockedTestID}BasePicker`);
  });

  it('renders picker options', () => {
    const options: SurveySelectOptions = new Map<string, string>([
      ['opt1', 'Option 1'],
      ['opt2', 'Option 2'],
    ]);

    const expectedOptions = Array.from(options);
    rendersPickerOptions(options, expectedOptions, undefined);
    rendersPickerOptions(options, expectedOptions, '');

    const expectedOptionsWithPlaceholder = Array.from(options);
    const placeholder = 'placeholder';
    expectedOptionsWithPlaceholder.unshift(['', placeholder]);
    rendersPickerOptions(options, expectedOptionsWithPlaceholder, placeholder);
  });

  it('renders picker options', () => {
    const options: SurveySelectOptions = new Map<string, string>([
      ['opt1', 'Option 1'],
      ['opt2', 'Option 2'],
    ]);

    const expectedOptions = Array.from(options);
    rendersPickerOptions(options, expectedOptions, undefined);
    rendersPickerOptions(options, expectedOptions, '');

    const expectedOptionsWithPlaceholder = Array.from(options);
    const placeholder = 'placeholder';
    expectedOptionsWithPlaceholder.unshift(['', placeholder]);
    rendersPickerOptions(options, expectedOptionsWithPlaceholder, placeholder);
  });

  it('renders picker options with useCode', () => {
    const options: SurveySelectOptions = new Map<string, string>([
      ['opt1', 'Option 1'],
      ['opt2', 'Option 2'],
    ]);

    const expectedOptions = Array.from(options);
    rendersPickerOptionsWithUseCode(options, expectedOptions, undefined);
    rendersPickerOptionsWithUseCode(options, expectedOptions, '');

    const expectedOptionsWithPlaceholder = Array.from(options);
    const placeholder = 'placeholder';
    expectedOptionsWithPlaceholder.unshift(['', placeholder]);
    rendersPickerOptionsWithUseCode(
      options,
      expectedOptionsWithPlaceholder,
      placeholder
    );
  });

  function rendersPickerOptions(
    options: SurveySelectOptions,
    expectedOptions: [string, string][],
    placeholder?: string
  ) {
    const testRenderer = renderer.create(
      <SurveySingleSelect
        onSelect={jest.fn()}
        options={options}
        placeholder={placeholder}
      />
    );

    const view = testRenderer.root.findByType(View);
    const picker = view.props.children;
    const pickerItems = picker.props.children;

    expect(pickerItems.length).toEqual(expectedOptions.length);

    pickerItems.forEach((item: ReactTestInstance, index: number) => {
      const [, label] = expectedOptions[index];

      expect(item.props.label).toEqual(label);
      if (placeholder && index === 0) {
        expect(item.props.value).toEqual('');
      } else {
        expect(item.props.value).toEqual(label);
      }
    });
  }

  function rendersPickerOptionsWithUseCode(
    options: SurveySelectOptions,
    expectedOptions: [string, string][],
    placeholder?: string
  ) {
    const testRenderer = renderer.create(
      <SurveySingleSelect
        onSelect={jest.fn()}
        options={options}
        placeholder={placeholder}
        useCode={true}
      />
    );

    const picker = testRenderer.root.findByType(BasePicker);

    const pickerItems = picker.props.children;

    expect(pickerItems.length).toEqual(expectedOptions.length);

    pickerItems.forEach((item: ReactTestInstance, index: number) => {
      const [code] = expectedOptions[index];

      expect(item.props.value).toEqual(code);
      if (placeholder && index === 0) {
        expect(item.props.value).toEqual('');
      } else {
        expect(item.props.value).toEqual(code);
      }
    });
  }
});
