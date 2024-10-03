// Copyright 2018 Prescryptive Health, Inc.

import React, { useEffect, useRef } from 'react';
import { TextInput, TextStyle, ViewStyle, View, Keyboard } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestContainer } from '../../../testing/test.container';
import { FieldErrorText } from '../../text/field-error/field-error.text';
import { FieldHelpText } from '../../text/field-help/field-help.text';
import { Label } from '../../text/label/label';
import { PrimaryTextInput, PrimaryTextContentType } from './primary-text.input';
import { primaryTextInputStyles } from './primary-text.input.styles';
import { getChildren } from '../../../testing/test.helper';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockReturnValue({}),
  },
  Keyboard: {
    dismiss: jest.fn(),
  },
  Platform: {
    select: jest.fn(),
  },
  TextInput: React.forwardRef(() => <div />),
  View: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../text/field-error/field-error.text', () => ({
  FieldErrorText: () => <div />,
}));

jest.mock('../../text/field-help/field-help.text', () => ({
  FieldHelpText: () => <div />,
}));

jest.mock('../../text/label/label', () => ({
  Label: () => <div />,
}));

describe('PrimaryTextInput', () => {
  beforeEach(() => {
    useEffectMock.mockReset();
    useRefMock.mockReset();
    useRefMock.mockReturnValue({ current: {} });
  });

  it.each([[undefined], ['label']])(
    'renders in view container (label: %p)',
    (labelMock: string | undefined) => {
      const customViewStyle: ViewStyle = { width: 1 };
      const testIDMock = 'testIDMock';
      const testRenderer = renderer.create(
        <PrimaryTextInput
          label={labelMock}
          onChangeText={jest.fn()}
          textContentType='name'
          viewStyle={customViewStyle}
          testID={testIDMock}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual([
        primaryTextInputStyles.viewStyle,
        customViewStyle,
      ]);
      expect(view.props.children.length).toEqual(3);
      expect(view.props.testID).toEqual(testIDMock);
    }
  );

  it.each([
    [undefined, undefined],
    [false, true],
    [true, false],
  ])(
    'renders text input in label if label prop specified (isRequired: %p)',
    (isRequiredMock?: boolean, isSkeleton?: boolean) => {
      const labelMock = 'label';
      const testRenderer = renderer.create(
        <PrimaryTextInput
          onChangeText={jest.fn()}
          label={labelMock}
          isRequired={isRequiredMock}
          isSkeleton={isSkeleton}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;
      const label = view.props.children[0];

      expect(label.type).toEqual(Label);
      expect(label.props.label).toEqual(labelMock);
      expect(label.props.isRequired).toEqual(isRequiredMock);
      expect(label.props.isSkeleton).toEqual(isSkeleton ?? false);

      const input = getChildren(label)[0];

      expect(input.type).toEqual(TextInput);
    }
  );

  it('renders text input directly in view container if label prop not specified', () => {
    const testRenderer = renderer.create(
      <PrimaryTextInput onChangeText={jest.fn()} label={undefined} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const input = view.props.children[0];

    expect(input.type).toEqual(TextInput);
  });

  it.each([
    [undefined, 'name', false],
    [false, 'name', false],
    [undefined, 'password', true],
    [false, 'password', true],
    [true, 'name', true],
  ])(
    'renders text input secure prop (secureTextEntry: %p, textContentType: %p)',
    (
      secureTextyEntryMock: undefined | boolean,
      textContentType: string,
      expectedSecureTextEntry: boolean
    ) => {
      const testRenderer = renderer.create(
        <PrimaryTextInput
          onChangeText={jest.fn()}
          textContentType={textContentType as PrimaryTextContentType}
          secureTextEntry={secureTextyEntryMock}
        />
      );

      const textInput = testRenderer.root.findByType(TextInput);
      expect(textInput.props.secureTextEntry).toEqual(expectedSecureTextEntry);
    }
  );

  it('renders text input content type', () => {
    const textContentTypeMock: PrimaryTextContentType = 'emailAddress';
    const testRenderer = renderer.create(
      <PrimaryTextInput
        onChangeText={jest.fn()}
        textContentType={textContentTypeMock}
      />
    );

    const textInput = testRenderer.root.findByType(TextInput);
    expect(textInput.props.textContentType).toEqual(textContentTypeMock);
  });

  it.each([
    [undefined, primaryTextInputStyles.inputTextStyle, true],
    [true, primaryTextInputStyles.inputTextStyle, true],
    [false, primaryTextInputStyles.readOnlyTextStyle, false],
  ])(
    'renders text input style (editable: %p)',
    (
      editableMock: boolean | undefined,
      expectedStyle: TextStyle,
      expectedEditableValue: boolean
    ) => {
      const testRenderer = renderer.create(
        <PrimaryTextInput onChangeText={jest.fn()} editable={editableMock} />
      );

      const textInput = testRenderer.root.findByType(TextInput);
      expect(textInput.props.style[0]).toEqual(expectedStyle);
      expect(textInput.props.editable).toEqual(expectedEditableValue);
    }
  );

  it.each([
    [undefined, undefined],
    ['', undefined],
    ['error', primaryTextInputStyles.inputErrorTextStyle],
  ])(
    'renders text input style (errorMessage: %p)',
    (
      errorMessageMock: string | undefined,
      expectedErrorTextStyle: TextStyle | undefined
    ) => {
      const testRenderer = renderer.create(
        <PrimaryTextInput
          onChangeText={jest.fn()}
          errorMessage={errorMessageMock}
        />
      );

      const textInput = testRenderer.root.findByType(TextInput);
      expect(textInput.props.style[1]).toEqual(expectedErrorTextStyle);
    }
  );

  it('sets text input props', () => {
    const onChangeTextMock = jest.fn();
    const multilineMock = true;
    const testIDMock = 'testIDMock';
    const testRenderer = renderer.create(
      <PrimaryTextInput
        onChangeText={onChangeTextMock}
        multiline={multilineMock}
        testID={testIDMock}
      />
    );

    const textInput = testRenderer.root.findByType(TextInput);
    expect(textInput.props.onChangeText).toEqual(onChangeTextMock);
    expect(textInput.props.multiline).toEqual(multilineMock);
    expect(textInput.props.testID).toEqual(`${testIDMock}TextInput`);
  });

  it.each([[undefined], ['error']])(
    'renders error message (%p)',
    (errorMessageMock: string | undefined) => {
      const testRenderer = renderer.create(
        <PrimaryTextInput
          onChangeText={jest.fn()}
          errorMessage={errorMessageMock}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;
      const fieldError = view.props.children[1];

      if (!errorMessageMock) {
        expect(fieldError).toBeNull();
      } else {
        expect(fieldError.type).toEqual(FieldErrorText);
        expect(fieldError.props.style).toEqual(
          primaryTextInputStyles.errorMessageTextStyle
        );
        expect(fieldError.props.children).toEqual(errorMessageMock);
      }
    }
  );

  it.each([
    [undefined, undefined, null],
    ['help', undefined, 'help'],
    ['help', 'error', null],
  ])(
    'renders help message (help: %p; error: %p)',
    (
      helpMessageMock: string | undefined,
      errorMessageMock: string | undefined,
      expectedHelpContent: string | null
    ) => {
      const testRenderer = renderer.create(
        <PrimaryTextInput
          onChangeText={jest.fn()}
          helpMessage={helpMessageMock}
          errorMessage={errorMessageMock}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;
      const fieldHelp = view.props.children[2];

      if (!expectedHelpContent) {
        expect(fieldHelp).toBeNull();
      } else {
        expect(fieldHelp.type).toEqual(FieldHelpText);
        expect(fieldHelp.props.style).toEqual(
          primaryTextInputStyles.helpMessageTextStyle
        );
        expect(fieldHelp.props.children).toEqual(expectedHelpContent);
      }
    }
  );

  it('calls onBlur callback when text input loses focus', () => {
    const textContentTypeMock: PrimaryTextContentType = 'emailAddress';
    const testRenderer = renderer.create(
      <PrimaryTextInput
        onChangeText={jest.fn()}
        textContentType={textContentTypeMock}
      />
    );

    const textInput = testRenderer.root.findByType(TextInput);
    textInput.props.onBlur();
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });
});
