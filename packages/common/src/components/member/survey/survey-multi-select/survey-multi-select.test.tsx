// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { FlatList } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SurveyMultiSelect } from './survey-multi-select';
import { surveyMultiSelectStyles } from './survey-multi-select.styles';
import { SurveySelectOptions } from '../../../../models/survey-questions';
import { PrimaryCheckBox } from '../../../checkbox/primary-checkbox/primary-checkbox';

jest.mock('../../../checkbox/primary-checkbox/primary-checkbox', () => ({
  PrimaryCheckBox: () => <div />,
}));

describe('SurveyMultiSelect', () => {
  it('renders as FlatList', () => {
    const optionsMock: SurveySelectOptions = new Map<string, string>([
      ['opt1', 'Option 1'],
      ['opt2', 'Option 2'],
      ['opt3', 'Option 3'],
    ]);

    const testRenderer = renderer.create(
      <SurveyMultiSelect onSelect={jest.fn()} options={optionsMock} />
    );

    const flatList = testRenderer.root.findByType(FlatList);

    const expectedData = Array.from(optionsMock);
    expect(flatList.props.data).toEqual(expectedData);

    const keyExtractor = flatList.props.keyExtractor;
    const itemMock = ['value', 'label'];
    expect(keyExtractor(itemMock)).toEqual(`${itemMock[1]}-${itemMock[0]}`);
  });

  it('renders checkboxes', () => {
    const optionsMock: SurveySelectOptions = new Map<string, string>([
      ['opt1', 'Option 1'],
      ['opt2', 'Option 2'],
      ['opt3', 'Option 3'],
    ]);
    const selectedValuesMock = ['Option 1', 'Option 3'];
    const mockedTestID = 'mockTestID';

    const testRenderer = renderer.create(
      <SurveyMultiSelect
        onSelect={jest.fn()}
        options={optionsMock}
        selectedValues={selectedValuesMock}
        testID={mockedTestID}
      />
    );

    const checkboxes = testRenderer.root.findAllByType(PrimaryCheckBox);

    expect(checkboxes.length).toEqual(optionsMock.size);

    const { checkboxTextStyle, checkboxViewStyle } = surveyMultiSelectStyles;
    const optionsArray = Array.from(optionsMock);
    checkboxes.forEach((checkbox: ReactTestInstance, index: number) => {
      const [, label] = optionsArray[index];
      expect(checkbox.props.checkBoxChecked).toEqual(
        selectedValuesMock.includes(label)
      );
      expect(checkbox.props.checkBoxLabel).toEqual(label);
      expect(checkbox.props.checkBoxValue).toEqual(label);
      expect(checkbox.props.checkBoxTextStyle).toEqual(checkboxTextStyle);
      expect(checkbox.props.checkBoxViewStyle).toEqual(checkboxViewStyle);
      expect(checkbox.props.testID).toEqual(`${mockedTestID}-${label}Check`);
    });
  });

  it('returns expected selections', () => {
    const optionsMock: SurveySelectOptions = new Map<string, string>([
      ['opt1', 'Option 1'],
      ['opt2', 'Option 2'],
      ['opt3', 'Option 3'],
    ]);

    const onSelectMock = jest.fn();

    const testRenderer = renderer.create(
      <SurveyMultiSelect onSelect={onSelectMock} options={optionsMock} />
    );

    const checkboxes = testRenderer.root.findAllByType(PrimaryCheckBox);
    const onPress = checkboxes[0].props.onPress;

    onPress(true, 'opt1');
    expect(onSelectMock).toHaveBeenLastCalledWith(['opt1']);

    onPress(true, 'opt3');
    expect(onSelectMock).toHaveBeenLastCalledWith(['opt1', 'opt3']);

    onPress(false, 'opt1');
    expect(onSelectMock).toHaveBeenLastCalledWith(['opt3']);
  });
});
