// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer from 'react-test-renderer';
import { PhoneMaskInput } from './phone.mask.input';
import { PrimaryTextInput } from '../../primary-text/primary-text.input';
import { phoneMaskInputContent } from './phone.mask.input.content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));

describe('PhoneMaskInput', () => {
  const maskedPhoneNumber = '';

  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValue([maskedPhoneNumber, jest.fn()]);
  });

  it('initializes state', () => {
    renderer.create(
      <PhoneMaskInput phoneNumber='1234' onPhoneNumberChange={jest.fn()} />
    );

    expect(useStateMock).toHaveBeenCalledTimes(1);
    expect(useStateMock).toHaveBeenNthCalledWith(1, '');
  });

  it('updates phone number state value when prop changes', () => {
    const setMaskedPhoneNumberMock = jest.fn();

    useStateMock.mockReset();
    useStateMock.mockReturnValue(['', setMaskedPhoneNumberMock]);

    const phoneNumberMock = '7781234567';
    renderer.create(
      <PhoneMaskInput
        phoneNumber={phoneNumberMock}
        onPhoneNumberChange={jest.fn()}
      />
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      phoneNumberMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(setMaskedPhoneNumberMock).toHaveBeenCalledWith('(778) 123-4567');
  });

  it('has expected props on PrimaryTextInput', () => {
    const viewStyleMock = { flex: 1 };
    const errorMock = 'error';
    const onSubmitEditingMock = jest.fn();
    const onPhoneNumberChangeMock = jest.fn();
    const labelMock = 'label';
    const editableMock = true;
    const isRequiredMock = true;
    const testIDMock = 'testIDMock';

    const testRenderer = renderer.create(
      <PhoneMaskInput
        phoneNumber=''
        viewStyle={viewStyleMock}
        label={labelMock}
        errorMessage={errorMock}
        onSubmitEditing={onSubmitEditingMock}
        onPhoneNumberChange={onPhoneNumberChangeMock}
        editable={editableMock}
        isRequired={isRequiredMock}
        testID={testIDMock}
      />
    );
    const textInput = testRenderer.root.findByType(PrimaryTextInput);
    expect(textInput.props.textContentType).toEqual('telephoneNumber');
    expect(textInput.props.value).toEqual(maskedPhoneNumber);
    expect(textInput.props.label).toEqual(labelMock);
    expect(textInput.props.viewStyle).toEqual(viewStyleMock);
    expect(textInput.props.errorMessage).toEqual(errorMock);
    expect(textInput.props.editable).toEqual(editableMock);
    expect(textInput.props.isRequired).toEqual(isRequiredMock);
    expect(textInput.props.keyboardType).toEqual('phone-pad');
    expect(textInput.props.placeholder).toEqual(
      phoneMaskInputContent.placeholder
    );
    expect(textInput.props.onSubmitEditing).toEqual(onSubmitEditingMock);
    expect(textInput.props.onChangeText).toEqual(expect.any(Function));
    expect(textInput.props.testID).toEqual(testIDMock);
  });

  it.each([
    ['1', '(1'],
    ['12', '(12'],
    ['123', '(123'],
    ['1234', '(123) 4'],
    ['12345', '(123) 45'],
    ['123456', '(123) 456'],
    ['1234567', '(123) 456-7'],
    ['12345678', '(123) 456-78'],
    ['123456789', '(123) 456-789'],
    ['1234567890', '(123) 456-7890'],
    ['12345678901', '(123) 456-78901'],
  ])(
    'render correct masked number (%p)',
    (inputNumber: string, expected: string) => {
      const setMasked = jest.fn();
      const onPhoneNumberChangeMock = jest.fn();
      useStateMock.mockReturnValue([expected, setMasked]);

      const testRenderer = renderer.create(
        <PhoneMaskInput
          phoneNumber=''
          onPhoneNumberChange={onPhoneNumberChangeMock}
        />
      );

      const input = testRenderer.root.findByType(PrimaryTextInput);

      input.props.onChangeText(inputNumber);

      expect(setMasked).toHaveBeenCalledWith(expected);
    }
  );

  it('render correct number and gets unmasked value', () => {
    const mockNumber = '(123) 456-7890';
    const expectedNumber = '1234567890';
    const changePhoneNumber = jest.fn();

    const testRenderer = renderer.create(
      <PhoneMaskInput onPhoneNumberChange={changePhoneNumber} />
    );

    const input = testRenderer.root.findByType(PrimaryTextInput);

    input.props.onChangeText(mockNumber);

    expect(changePhoneNumber).toHaveBeenCalledWith(expectedNumber);
  });
});
