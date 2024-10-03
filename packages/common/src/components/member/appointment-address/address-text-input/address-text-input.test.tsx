// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { AddressFieldName } from '../../../../models/address-fields';
import { PrimaryTextInput } from '../../../inputs/primary-text/primary-text.input';
import { AddressTextInput } from './address-text-input';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

jest.mock('../../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));

const useStateMock = useState as jest.Mock;
const setValidMock = jest.fn();

const longStringMock = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;

const errorMessage1Mock = 'error message1';
const errorMessage2Mock = 'error message2';

beforeEach(() => {
  useStateMock.mockReset();
});

describe('AddressTextInput', () => {
  it('renders as Text input with expected properties', () => {
    useStateMock.mockReturnValueOnce([true, setValidMock]);
    useStateMock.mockReturnValueOnce([false, setValidMock]);

    const onChangeTextMock = jest.fn();
    const labelMock = 'label';
    const isRequiredMock = true;
    const placeholderMock = 'placeholder';
    const stylesMock: ViewStyle = { width: 1 };
    const defaultMock = 'default';
    const isEditableMock = true;
    const mockTestID = 'mockedTestID';
    const testRenderer = renderer.create(
      <AddressTextInput
        placeholder={placeholderMock}
        onAddressChange={onChangeTextMock}
        name={AddressFieldName.STREET_NAME}
        label={labelMock}
        required={isRequiredMock}
        style={stylesMock}
        defaultValue={defaultMock}
        editable={isEditableMock}
        errorMessage={[errorMessage1Mock]}
        testID={mockTestID}
      />
    );

    const textInput = testRenderer.root.children[0] as ReactTestInstance;

    expect(textInput.type).toEqual(PrimaryTextInput);
    expect(textInput.props.label).toEqual(labelMock);
    expect(textInput.props.isRequired).toEqual(isRequiredMock);
    expect(textInput.props.placeholder).toEqual(placeholderMock);
    expect(textInput.props.viewStyle).toEqual(stylesMock);
    expect(textInput.props.defaultValue).toEqual(defaultMock);
    expect(textInput.props.editable).toEqual(isEditableMock);
    expect(textInput.props.onChangeText).toEqual(expect.any(Function));
    expect(textInput.props.testID).toEqual(`${mockTestID}PrimaryTextInput`);
  });
  it('renders error message when Text input has invalid input (less than 5 characters streeen name)', () => {
    useStateMock.mockReturnValueOnce([false, setValidMock]);
    useStateMock.mockReturnValueOnce([true, setValidMock]);

    const onChangeTextMock = jest.fn();

    const testRenderer = renderer.create(
      <AddressTextInput
        onAddressChange={onChangeTextMock}
        name={AddressFieldName.STREET_NAME}
        errorMessage={[errorMessage1Mock, errorMessage2Mock]}
        label='test label'
      />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);

    const invalidTextMock = 'test';

    const onChangedText = input.props.onChangeText;
    onChangedText(invalidTextMock);
    expect(input.props.errorMessage).toBe(errorMessage1Mock);
  });

  it('renders error message when Text input has invalid input (max characters)', () => {
    useStateMock.mockReturnValueOnce([false, setValidMock]);
    useStateMock.mockReturnValueOnce([false, setValidMock]);

    const onChangeTextMock = jest.fn();

    const testRenderer = renderer.create(
      <AddressTextInput
        onAddressChange={onChangeTextMock}
        name={AddressFieldName.STREET_NAME}
        errorMessage={[errorMessage1Mock, errorMessage2Mock]}
        label='test label'
      />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);

    const onChangedText = input.props.onChangeText;
    onChangedText(longStringMock);
    expect(input.props.errorMessage).toBe(errorMessage2Mock);
  });
  it('calls onChangeText with values when text input is valid', () => {
    useStateMock.mockReturnValueOnce([true, setValidMock]);
    useStateMock.mockReturnValueOnce([false, setValidMock]);

    const onChangeTextMock = jest.fn();

    const testRenderer = renderer.create(
      <AddressTextInput
        onAddressChange={onChangeTextMock}
        name={AddressFieldName.STREET_NAME}
        errorMessage={['']}
        label='test label'
      />
    );

    const primaryTextInput = testRenderer.root.findByType(PrimaryTextInput);

    const onChangedText = primaryTextInput.props.onChangeText;
    onChangedText('new Value');
    expect(onChangeTextMock).toBeCalledWith(
      'new Value',
      AddressFieldName.STREET_NAME
    );
  });
});
