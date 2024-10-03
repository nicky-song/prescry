// Copyright 2020 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { AddressSingleSelect } from './address-single-select';
import { AddressFieldName } from '../../../../models/address-fields';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { ITestContainer } from '../../../../testing/test.container';
import { BasePicker } from '../../pickers/base/base.picker';

jest.mock('../../pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

jest.mock('../../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const setValidMock = jest.fn();
const setValueMock = jest.fn();
beforeEach(() => {
  useStateMock.mockReset();
  useEffectMock.mockReset();
});
const options: [string, string][] = [
  ['', 'Select state'],
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
];

const errorMessageMock = 'error message';

describe('AddressSingleSelect', () => {
  it('renders Picker with expected properties', () => {
    useStateMock
      .mockReturnValueOnce([true, setValidMock])
      .mockReturnValueOnce(['', setValueMock]);

    const onChangeTextMock = jest.fn();

    const customTextStyle: TextStyle = {
      width: 1,
    };
    const mockTestID = 'mockTestID';
    const testRenderer = renderer.create(
      <AddressSingleSelect
        onAddressChange={onChangeTextMock}
        name={AddressFieldName.STATE}
        errorMessage={[]}
        options={options}
        markdownLabel='test label'
        style={customTextStyle}
        testID={mockTestID}
      />
    );

    const markdownText = testRenderer.root.findByType(MarkdownText);
    expect(markdownText.props.children).toEqual('test label');

    const picker = testRenderer.root.findByType(BasePicker);
    expect(picker.props.style).toEqual(customTextStyle);
    expect(picker.props.children.length).toBe(4);
    expect(picker.props.testID).toBe(`${mockTestID}BasePicker`);

    const errorText = testRenderer.root.findAllByType(Text);
    const onValueChange = picker.props.onValueChange;
    onValueChange('AK');
    expect(errorText.length).toBe(0);
  });

  it('renders error message when Picker has invalid input', () => {
    useStateMock
      .mockReturnValueOnce([false, setValidMock])
      .mockReturnValueOnce(['', setValueMock]);

    const onChangeTextMock = jest.fn();
    const testRenderer = renderer.create(
      <AddressSingleSelect
        onAddressChange={onChangeTextMock}
        name={AddressFieldName.STATE}
        errorMessage={[errorMessageMock]}
        options={options}
        markdownLabel='test label'
      />
    );

    const input = testRenderer.root.findByType(BasePicker);
    const errorText = testRenderer.root.findAllByType(Text)[0];
    const onValueChange = input.props.onValueChange;
    onValueChange('');
    expect(errorText.props.children).toBe(errorMessageMock);
  });
});
